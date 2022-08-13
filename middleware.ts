import { NextMiddleware, NextResponse, userAgent } from 'next/server'
// import type { NextRequest } from 'next/server'
import { IS_DEV, CUR_LANGUAGE_LIST, IS_TEST } from './modules/constants/constants'
import UrlPattern from 'url-pattern'
// login assets
// const authUrlList = ['/wallet', '/transfer', '/send', '/setting', '/restore-wallet']
// const PAGES = ['api', 'assets', 'login', 'send', 'setting', 'test', 'transfer', 'wallet']

const APP_UA = /iPhone/i
const isRemoveAuth = IS_DEV || IS_TEST // 去除APP_UA限制
const pattern = new UrlPattern('/:locale/:slug');

const ALL_LANGUAGE = [
  'en', 'de', 'es', 'fr',
  'it', 'ru', 'zh-Hans', 'zh-Hant',
  'pt', 'ko', 'ja', 'tr',
  'nl', 'cs', 'hu', 'id',
  'th', 'sl', 'vi', 'ar',
  'pl', 'no', 'sv', 'fi',
  'ro', 'el', 'da', 'ms',
  'he', 'sk', 'uk', 'ca',
  'bg', 'hi', 'lv', 'fa',
  'et', 'lt', 'ur'
]

export const middleware: NextMiddleware = (request, event) => {
  if (request.nextUrl.pathname.startsWith('/_next') || request.nextUrl.pathname.startsWith('/api')) {
    return undefined;
  }
  // const { ip, geo } = request
  // console.log(request.ip, geo?.country)

  // const device = ua?.device || {}
  // const viewport = device.type === 'mobile' ? 'mobile' : 'desktop'
  // nextUrl.searchParams.set('viewport', viewport)

  const { search, protocol, host } = request.nextUrl
  const match: TObjetString = pattern.match(request.nextUrl.pathname)
  let locale_ = (match?.locale || '').toLowerCase()
  // 不存在语言的跳转处理
  // /zh-Hans/login -> /zh/login
  if (locale_.startsWith('zh-')) {
    const rurl = new URL(`${protocol}//${host}/zh/${match.slug}${search}`)
    return NextResponse.redirect(rurl)
  }
  // /ja/login -> /login
  if (locale_ && match?.slug && ALL_LANGUAGE.includes(locale_) && !CUR_LANGUAGE_LIST.includes(locale_)) {
    const rurl = new URL(`${protocol}//${host}/${match.slug}${search}`)
    return NextResponse.redirect(rurl)
  }

  const response = new NextResponse()
  response.cookies.set('vercel', 'fast')
  const ua = userAgent(request)
  // console.log(ua)
  // userAgent限制
  if (ua?.ua && APP_UA.test(ua.ua) || isRemoveAuth) {
    const response = NextResponse.rewrite(request.nextUrl) // creates an actual instance
    // const ip = '' // request.ip TODO
    // const country = '' // request.geo?.country || '' TODO
    response.cookies.set('os', ua?.os.name || '')
    return response
  } else {
    if (!request.nextUrl.pathname.startsWith('/401')) {
      const redirectUrl = new URL('/401', request.url)
      // redirectUrl.searchParams.set('from', request.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }
  }
}
