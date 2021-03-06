import loadPolyfills from 'flavours/glitch/util/load_polyfills';
import ready from 'flavours/glitch/util/ready';

function main() {
  const IntlRelativeFormat = require('intl-relativeformat').default;
  const emojify = require('flavours/glitch/util/emoji').default;
  const { getLocale } = require('locales');
  const { localeData } = getLocale();
  const VideoContainer = require('flavours/glitch/containers/video_container').default;
  const CardContainer = require('flavours/glitch/containers/card_container').default;
  const React = require('react');
  const ReactDOM = require('react-dom');

  localeData.forEach(IntlRelativeFormat.__addLocaleData);

  ready(() => {
    const locale = document.documentElement.lang;

    const dateTimeFormat = new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    });

    const relativeFormat = new IntlRelativeFormat(locale);

    [].forEach.call(document.querySelectorAll('.emojify'), (content) => {
      content.innerHTML = emojify(content.innerHTML);
    });

    [].forEach.call(document.querySelectorAll('time.formatted'), (content) => {
      const datetime = new Date(content.getAttribute('datetime'));
      const formattedDate = dateTimeFormat.format(datetime);

      content.title = formattedDate;
      content.textContent = formattedDate;
    });

    [].forEach.call(document.querySelectorAll('time.time-ago'), (content) => {
      const datetime = new Date(content.getAttribute('datetime'));

      content.title = dateTimeFormat.format(datetime);
      content.textContent = relativeFormat.format(datetime);
    });

    [].forEach.call(document.querySelectorAll('.logo-button'), (content) => {
      content.addEventListener('click', (e) => {
        e.preventDefault();
        window.open(e.target.href, 'mastodon-intent', 'width=400,height=400,resizable=no,menubar=no,status=no,scrollbars=yes');
      });
    });

    [].forEach.call(document.querySelectorAll('[data-component="Video"]'), (content) => {
      const props = JSON.parse(content.getAttribute('data-props'));
      ReactDOM.render(<VideoContainer locale={locale} {...props} />, content);
    });

    [].forEach.call(document.querySelectorAll('[data-component="Card"]'), (content) => {
      const props = JSON.parse(content.getAttribute('data-props'));
      ReactDOM.render(<CardContainer locale={locale} {...props} />, content);
    });

    const mediaGalleries = document.querySelectorAll('[data-component="MediaGallery"]');

    if (mediaGalleries.length > 0) {
      const MediaGalleriesContainer = require('flavours/glitch/containers/media_galleries_container').default;
      const content = document.createElement('div');

      ReactDOM.render(<MediaGalleriesContainer locale={locale} galleries={mediaGalleries} />, content);
      document.body.appendChild(content);
    }
  });
}

loadPolyfills().then(main).catch(error => {
  console.error(error);
});
