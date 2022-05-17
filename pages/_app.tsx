import React from 'react';
import { NextIntlProvider } from 'next-intl';
import Script from 'next/script';
import { useRouter } from 'next/router';
import * as gtag from '../lib/gtag';

import Web3ModalProvider from '../components/web3modal';

import 'leaflet/dist/leaflet.css';
import '../styles/globals.css';
import 'tailwindcss/tailwind.css';

const regex_match =
  /(nokia|iphone|android|motorola|^mot-|softbank|foma|docomo|kddi|up.browser|up.link|htc|dopod|blazer|netfront|helio|hosin|huawei|novarra|CoolPad|webos|techfaith|palmsource|blackberry|alcatel|amoi|ktouch|nexian|samsung|^sam-|s[cg]h|^lge|ericsson|philips|sagem|wellcom|bunjalloo|maui|symbian|smartphone|midp|wap|phone|windows ce|iemobile|^spice|^bird|^zte-|longcos|pantech|gionee|^sie-|portalmmm|jigs browser|hiptop|^benq|haier|^lct|operas*mobi|opera*mini|320x320|240x320|176x220)/i;

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  React.useEffect(() => {
    const handleRouteChange = (url) => {
      gtag.pageview(url);
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  React.useEffect(() => {
    const u = navigator.userAgent;

    const result = regex_match.exec(u);

    if (result) {
      document.location.href = 'https://m-metacat-world-metacat.vercel.app/';
    }
  }, [regex_match]);

  return (
    <>
      {/* Global Site Tag (gtag.js) - Google Analytics */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gtag.GA_TRACKING_ID}`}
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gtag.GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
      <NextIntlProvider
        // To achieve consistent date, time and number formatting
        // across the app, you can define a set of global formats.
        formats={{
          dateTime: {
            short: {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            },
          },
        }}
        messages={pageProps.messages}
        // Providing an explicit value for `now` ensures consistent formatting of
        // relative values regardless of the server or client environment.
        now={new Date(pageProps.now)}
        // Also an explicit time zone is helpful to ensure dates render the
        // same way on the client as on the server, which might be located
        // in a different time zone.
        timeZone="Asia/ShangHai"
      >
        <Web3ModalProvider>
          <Component {...pageProps} />
        </Web3ModalProvider>
      </NextIntlProvider>
    </>
  );
}

export default MyApp;
