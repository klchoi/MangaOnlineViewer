// ==UserScript==
// @name Manga OnlineViewer
// @author Tago
// @updateURL https://github.com/TagoDR/MangaOnlineViewer/raw/master/Manga_OnlineViewer.meta.js
// @downloadURL https://github.com/TagoDR/MangaOnlineViewer/raw/master/Manga_OnlineViewer.user.js
// @namespace https://github.com/TagoDR
// @description Shows all pages at once in online view for these sites: Batoto, ComiCastle, Dynasty-Scans, EatManga, Easy Going Scans, FoOlSlide, KissManga, MangaDoom, MangaFox, MangaGo, MangaHere, MangaInn, MangaLyght, MangaPark, MangaReader,MangaPanda, MangaStream, MangaTown, NineManga, ReadManga.Today, SenManga(Raw), TenManga, TheSpectrum, MangaDeep
// @version 13.0.1
// @date 2017-07-10
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_listValues
// @grant GM_xmlhttpRequest
// @require https://code.jquery.com/jquery-latest.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/jszip/3.1.3/jszip.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/nprogress/0.2.0/nprogress.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/sweetalert/1.1.3/sweetalert.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/jscolor/2.0.4/jscolor.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/color-scheme/1.0.0/color-scheme.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/ramda/0.24.1/ramda.min.js
// @include /https?:\/\/(www.)?bato.to\/reader.*/
// @include /https?:\/\/(www.)?comicastle.org\/comic\/.+\/[0-9]+.*/
// @include /https?:\/\/(www.)?dynasty-scans.com\/chapters\/.+/
// @include /https?:\/\/(www.)?eatmanga.me\/Manga-Scan\/.+\/.+\//
// @include /https?:\/\/read.egscans.com\/.+/
// @include /.+\/read\/.+/
// @include /https?:\/\/(www.)?kissmanga.com\/Manga\/.+\/.+?id=[0-9]+/
// @include /https?:\/\/(www.)?mangadoom.co\/.+\/[0-9]+/
// @include /https?:\/\/(www.)?mangafox.me\/manga\/.+\/.+\//
// @include /https?:\/\/(www.)?mangago.me\/read-manga\/.+\/.+/
// @include /https?:\/\/(www.)?mangahere.co\/manga\/.+\/.+/
// @include /https?:\/\/(www.)?mangainn.net\/manga\/chapter\/.+/
// @include /https?:\/\/manga.lyght.net\/series\/.+\.html/
// @include /https?:\/\/(www.)?mangapark.me\/manga\/.+\/.+/
// @include /https?:\/\/(www.)?(mangareader|mangapanda)(.net|.com)\/.+\/.+/
// @include /https?:\/\/(www.)?(mangastream|readms)(.net|.com)\/r.*\/.+/
// @include /https?:\/\/(www.)?mangatown.com\/manga\/.+\/.+/
// @include /https?:\/\/(www.)?ninemanga.com\/chapter\/.+\/.+\.html/
// @include /https?:\/\/(www.)?readmanga.today\/.+\/[0-9]+/
// @include /https?:\/\/raw.senmanga.com\/.+\/.+\/?/
// @include /https?:\/\/(www.)?tenmanga.com\/chapter\/.+/
// @include /https?:\/\/view.thespectrum.net\/.+/
// @include /https?:\/\/(www.)?(mangaspy|mangadeep|mangateen).com\/.+\/[0-9]+/
// @exclude /https?:\/\/(www.)?tsumino.com\/.+/
// @exclude /https?:\/\/(www.)?pururin.us\/.+/
// ==/UserScript==