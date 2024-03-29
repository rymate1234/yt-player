import ytdl, { Author } from 'ytdl-core'

import { PassThrough, Readable } from 'stream'

import { encodeImageToBlurHash, encodeImageToColours } from './encode-image'
import ffmpeg, { setFfmpegPath } from 'fluent-ffmpeg'
import path from 'ffmpeg-static'

setFfmpegPath(path)

export interface Video {
  id: string
  title: string
  channelName: string
  thumb: string
  blurHash: string
  url?: string
  channelUrl?: string
  length?: number
  related?: Video[]
  colours: string[]
}

export const getYoutube = async (
  url: string,
  stream: boolean
): Promise<Video | Readable> => {
  if (!url) {
    throw new Error('URL is required')
  }

  const videoInfo = await ytdl.getInfo(url)

  if (stream) {
    return ytdl(url, {
      liveBuffer: 25000,
      highWaterMark: 1024 * 1024 * 100,
      quality: 'highestaudio',
      filter: (format) => format.container === 'mp4',
      //highWaterMark: 1 << 25,
    })
  } else {
    const playerResponse = videoInfo.player_response

    // @ts-ignore
    const largeThumb = playerResponse.videoDetails.thumbnail.thumbnails.pop()

    const info = videoInfo.videoDetails

    const blurHash = await encodeImageToBlurHash(largeThumb.url)
    const colours = await encodeImageToColours(largeThumb.url)

    const related = await Promise.all(
      videoInfo.related_videos
        .filter((video) => !!video.title && !!video.id)
        .map(
          async (video: ytdl.relatedVideo): Promise<Video> => {
            const blurHash = await encodeImageToBlurHash(video.thumbnails[0].url)
            const colours = await encodeImageToColours(video.thumbnails[0].url)

            return {
              title: video.title,
              thumb: video.thumbnails[0].url,
              channelName: (video.author as Author).name,
              id: video.id,
              blurHash,
              colours
            }
          }
        )
    )

    const infoObj: Video = {
      title: info.title.trim(),
      channelName: info.author.name,
      channelUrl: info.author.channel_url,
      thumb: largeThumb.url,
      blurHash,
      id: info.videoId,
      length: Number.parseInt(info.lengthSeconds),
      related,
      colours
    }

    return infoObj
  }
}

export const getFromRequest = async (req, res, stream): Promise<Video | Readable> => {
  const url = req.body.url || `https://youtube.com/watch?v=${req.query.id}`
  let youtube: Video | Readable = null
  try {
    youtube = await getYoutube(url, stream)
  } catch (e) {
    res.status('404').send({ error: `Could not stream: ${e}` })
  }

  if (stream) {
    const input = youtube as Readable
    const stream = new PassThrough()
    const ff = ffmpeg(input)
      //.native()
      .format('mp3')
      .audioBitrate('128')
      .on('end', () => {
        console.log('Successfully converted file')
      })
      .on('error', (err) => {
        console.log(err)
      })

    ff.pipe(stream)

    return stream
  }

  return youtube as Video
}

export const getInfo = async (req, res) => {
  const info = await getFromRequest(req, res, false)
  if (!info) return

  res.setHeader('Cache-Control', 's-maxage=0, stale-while-revalidate')
  res.send(info)
}
