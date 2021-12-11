import { logScript } from './browser';
import { settings } from './settings';
import { isEmpty, mapIndexed } from './utils';

// Get html pages content
function getHtml(url, wait = settings.Timer) {
  return new Promise((resolve) => {
    setTimeout(() => {
      logScript(`Getting page: ${url}`);
      $.ajax({
        type: 'GET',
        url,
        dataType: 'html',
        async: true,
        success: (html) => {
          logScript(`Got page: ${url}`);
          resolve(html);
        },
        // retryCount and retryLimit will let you retry a determined number of times
        retryCount: 0,
        retryLimit: 10,
        // retryTimeout limits the next retry (in milliseconds)
        retryWait: 10000,
        // timeout for each request
        timeout: 1000,
        // created tells when this request was created
        created: Date.now(),
        error() {
          this.retryCount += 1;
          if (this.retryCount <= this.retryLimit) {
            logScript(`Retrying Getting page: ${url}`);
            setTimeout(() => {
              $.ajax(this);
            }, this.retryWait);
          } else {
            logScript(`Failed Getting page: ${url}`);
          }
        },
      });
    }, wait);
  });
}

// After pages load apply default Zoom
function applyZoom(page, newZoom) {
  const zoom = newZoom || settings.Zoom;
  const pages = page || '.PageContent img';
  $(pages).each((index, value) => {
    $(value).removeAttr('width')
      .removeAttr('height')
      .removeAttr('style');
    if (zoom === 1000) {
      $(value).width($(window).width());
    } else if (zoom === -1000) {
      $(value).height($(window).height()
        + ($('#Navigation').hasClass('disabled') ? 0 : -34)
        + ($('#Chapter').hasClass('WebComic') ? 0 : -35));
    } else {
      $(value).width($(value).prop('naturalWidth') * (zoom / 100));
    }
  });
}

// Force reload the image
function reloadImage(img) {
  const src = img.attr('src');
  if (src !== undefined) {
    img.removeAttr('src');
    setTimeout(() => {
      img.attr('src', src);
    }, 500);
  }
}

function onImagesDone() {
  logScript('Images Loading Complete');
  if (!settings.lazyLoadImages) {
    $('.download').attr('href', '#download');
    logScript('Download Available');
    if (settings.DownloadZip) {
      $('#blob').click();
    }
  }
}

function updateProgress() {
  const total = $('.PageContent img').get().length;
  const loaded = $('.PageContent img.imgLoaded').get().length;
  const percentage = Math.floor((loaded / total) * 100);
  $('title').html(`(${percentage}%) ${$('#series i').text()}`);
  $('#Counters i, #NavigationCounters i').html(loaded);
  NProgress.configure({
    showSpinner: false,
  }).set(loaded / total);
  logScript(`Progress: ${percentage}%`);
  if (loaded === total) onImagesDone();
}

// change class if the image is loaded or broken
function onImagesProgress(imgLoad, image) {
  const $item = $(image.img);
  if (image.isLoaded) {
    $item.addClass('imgLoaded');
    $item.removeClass('imgBroken');
    const thumb = $item.attr('id').replace('PageImg', 'ThumbnailImg');
    $(`#${thumb}`).attr('src', $item.attr('src'));
    applyZoom($item);
  } else {
    $item.addClass('imgBroken');
    reloadImage($item);
    $item.parent().imagesLoaded().progress(onImagesProgress);
  }
  updateProgress();
}

// Corrects urls
function normalizeUrl(url) {
  let uri = url.trim();
  if (uri.startsWith('//')) {
    uri = `https:${uri}`;
  }
  return uri;
}

// Adds an image to the place-holder div
function addImg(index, imageSrc) {
  const src = normalizeUrl(imageSrc);
  if (!settings.lazyLoadImages || index < settings.lazyStart) {
    $(`#PageImg${index}`).attr('src', src);
    $(`#PageImg${index}`).parent().imagesLoaded().progress(onImagesProgress);
    logScript('Loaded Image:', index, 'Source:', src);
  } else {
    $(`#PageImg${index}`)
      .attr('data-src', src)
      .unveil({
        offset: 1000,
      })
      .on('loaded.unveil', () => {
        $(`#PageImg${index}`).parent().imagesLoaded().progress(onImagesProgress);
        logScript('Unveiled Image: ', index, ' Source: ', $(`#PageImg${index}`).attr('src'));
      });
  }
  return index;
}

// Adds an page to the place-holder div
function addPage(manga, index, pageUrl) {
  if (!settings.lazyLoadImages || index < settings.lazyStart) {
    getHtml(pageUrl)
      .then((response) => {
        const src = normalizeUrl($(response).find(manga.img).attr(manga.lazyAttr || 'src'));
        $(`#PageImg${index}`).attr('src', src);
        $(`#PageImg${index}`).parent().imagesLoaded().progress(onImagesProgress);
        logScript('Loaded Page:', index, 'Source:', src);
      });
  } else {
    $(`#PageImg${index}`)
      .attr('data-src', 'data:image/gif;base64,R0lGODlhAQABAIAAAP///////yH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==')
      .unveil({
        offset: 2000,
      })
      .on('loaded.unveil', () => {
        getHtml(pageUrl)
          .then((response) => {
            const src = normalizeUrl($(response).find(manga.img).attr(manga.lazyAttr || 'src'));
            $(`#PageImg${index}`).attr('src', src).width('auto');
            $(`#PageImg${index}`).parent().imagesLoaded().progress(onImagesProgress);
            logScript('Unveiled Page: ', index, ' Source: ', $(`#PageImg${index}`).attr('src'));
          });
      });
  }
  return index;
}

// daley the use of a url/src
function delayAdd(src, wait = settings.Timer) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(src);
    }, wait);
  });
}

// use a list of pages to fill the viewer
const loadMangaPages = (begin, manga) => mapIndexed(
  (url, index) => (index >= begin ? delayAdd(url,
    (manga.timer || settings.Timer) * (index - begin))
    .then((response) => addPage(manga, index + 1, response)) : null),
  manga.listPages,
);

// use a list of images to fill the viewer
const loadMangaImages = (begin, manga) => mapIndexed(
  (src, index) => (index >= begin ? delayAdd(src,
    (manga.timer || settings.Timer) * (index - begin))
    .then((response) => addImg(index + 1, response)) : null),
  manga.listImages,
);

// Entry point for loading hte Manga pages
function loadManga(manga, begin = 1) {
  settings.lazyLoadImages = manga.lazy || settings.lazyLoadImages;
  logScript('Loading Images');
  logScript(`Intervals: ${manga.timer || settings.Timer || 'Default(1000)'}`);
  logScript(`Lazy: ${settings.lazyLoadImages}`);
  if (settings.lazyLoadImages) {
    logScript('Download may not work with Lazy Loading Images');
  }
  if (!isEmpty(manga.listImages)) {
    logScript('Method: Images:', manga.listImages);
    loadMangaImages(begin - 1, manga);
  } else if (!isEmpty(manga.listPages)) {
    logScript('Method: Pages:', manga.listPages);
    loadMangaPages(begin - 1, manga);
  } else {
    logScript('Method: Brute Force');
    manga.bruteForce({
      begin,
      addImg,
      addPage: (...args) => addPage(manga, ...args),
      loadMangaImages: (...args) => loadMangaImages(begin - 1, ...args),
      loadMangaPages: (...args) => loadMangaPages(begin - 1, ...args),
      getHtml,
      wait: settings.timer,
    });
  }
}

export {
  loadManga,
  applyZoom,
  reloadImage,
};
