if (!self.define) {
  let e,
    a = {};
  const s = (s, i) => (
    (s = new URL(s + ".js", i).href),
    a[s] ||
      new Promise((a) => {
        if ("document" in self) {
          const e = document.createElement("script");
          ((e.src = s), (e.onload = a), document.head.appendChild(e));
        } else ((e = s), importScripts(s), a());
      }).then(() => {
        let e = a[s];
        if (!e) throw new Error(`Module ${s} didn’t register its module`);
        return e;
      })
  );
  self.define = (i, c) => {
    const n =
      e ||
      ("document" in self ? document.currentScript.src : "") ||
      location.href;
    if (a[n]) return;
    let f = {};
    const t = (e) => s(e, n),
      r = { module: { uri: n }, exports: f, require: t };
    a[n] = Promise.all(i.map((e) => r[e] || t(e))).then((e) => (c(...e), f));
  };
}
define(["./workbox-bb54ffba"], function (e) {
  "use strict";
  (importScripts(),
    self.skipWaiting(),
    e.clientsClaim(),
    e.precacheAndRoute(
      [
        {
          url: "/_next/app-build-manifest.json",
          revision: "c7bf1d08f8f32ae39f21ee68c47f7f2f",
        },
        {
          url: "/_next/static/chunks/125-d3ef0127e9df415d.js",
          revision: "d3ef0127e9df415d",
        },
        {
          url: "/_next/static/chunks/139.8d54880d25bc452f.js",
          revision: "8d54880d25bc452f",
        },
        {
          url: "/_next/static/chunks/205-482c16595578a2d4.js",
          revision: "482c16595578a2d4",
        },
        {
          url: "/_next/static/chunks/239-53734aaf2810b89a.js",
          revision: "53734aaf2810b89a",
        },
        {
          url: "/_next/static/chunks/493-12473ff83b5f0e8e.js",
          revision: "12473ff83b5f0e8e",
        },
        {
          url: "/_next/static/chunks/4bd1b696-409494caf8c83275.js",
          revision: "409494caf8c83275",
        },
        {
          url: "/_next/static/chunks/646.c2c67a3e35c59670.js",
          revision: "c2c67a3e35c59670",
        },
        {
          url: "/_next/static/chunks/710-1754952150cbb30e.js",
          revision: "1754952150cbb30e",
        },
        {
          url: "/_next/static/chunks/798-b0ad7f030fa4ca02.js",
          revision: "b0ad7f030fa4ca02",
        },
        {
          url: "/_next/static/chunks/app/_not-found/page-0a2aadb273e87fb8.js",
          revision: "0a2aadb273e87fb8",
        },
        {
          url: "/_next/static/chunks/app/dashboard/insights/page-3af22a55c3aa27a5.js",
          revision: "3af22a55c3aa27a5",
        },
        {
          url: "/_next/static/chunks/app/dashboard/page-8950d7d88a0bc796.js",
          revision: "8950d7d88a0bc796",
        },
        {
          url: "/_next/static/chunks/app/groups/%5BgroupId%5D/add-expense/page-5d7a79aaebe28da1.js",
          revision: "5d7a79aaebe28da1",
        },
        {
          url: "/_next/static/chunks/app/groups/%5BgroupId%5D/add-member/page-d0d06feb540f80ef.js",
          revision: "d0d06feb540f80ef",
        },
        {
          url: "/_next/static/chunks/app/groups/%5BgroupId%5D/page-942b3062d2ee5153.js",
          revision: "942b3062d2ee5153",
        },
        {
          url: "/_next/static/chunks/app/groups/%5BgroupId%5D/settle/page-e73d392e33d8fb95.js",
          revision: "e73d392e33d8fb95",
        },
        {
          url: "/_next/static/chunks/app/groups/create/page-9e6c428507a449c7.js",
          revision: "9e6c428507a449c7",
        },
        {
          url: "/_next/static/chunks/app/layout-f850795995f85238.js",
          revision: "f850795995f85238",
        },
        {
          url: "/_next/static/chunks/app/login/page-fed266f04c633e0d.js",
          revision: "fed266f04c633e0d",
        },
        {
          url: "/_next/static/chunks/app/notifications/page-34e5ed15fae37715.js",
          revision: "34e5ed15fae37715",
        },
        {
          url: "/_next/static/chunks/app/page-c6733765777bda2b.js",
          revision: "c6733765777bda2b",
        },
        {
          url: "/_next/static/chunks/app/profile/page-228116fcb11b432d.js",
          revision: "228116fcb11b432d",
        },
        {
          url: "/_next/static/chunks/app/signup/page-6ac72d9a46b4a5fe.js",
          revision: "6ac72d9a46b4a5fe",
        },
        {
          url: "/_next/static/chunks/framework-1ce91eb6f9ecda85.js",
          revision: "1ce91eb6f9ecda85",
        },
        {
          url: "/_next/static/chunks/main-a9f72d3b7bdf9f1d.js",
          revision: "a9f72d3b7bdf9f1d",
        },
        {
          url: "/_next/static/chunks/main-app-ed81947ab21a6305.js",
          revision: "ed81947ab21a6305",
        },
        {
          url: "/_next/static/chunks/pages/_app-966fd9da0b06d2e1.js",
          revision: "966fd9da0b06d2e1",
        },
        {
          url: "/_next/static/chunks/pages/_error-cbc3f8f54f6cbf0f.js",
          revision: "cbc3f8f54f6cbf0f",
        },
        {
          url: "/_next/static/chunks/polyfills-42372ed130431b0a.js",
          revision: "846118c33b2c0e922d7b3a7676f81f6f",
        },
        {
          url: "/_next/static/chunks/webpack-a3cf5bda7a21f6b5.js",
          revision: "a3cf5bda7a21f6b5",
        },
        {
          url: "/_next/static/css/8d4298aea71bd10b.css",
          revision: "8d4298aea71bd10b",
        },
        {
          url: "/_next/static/eODf_NhSJAsbEKppnLrxk/_buildManifest.js",
          revision: "3d683a8fe6367515552e34f4f59df69d",
        },
        {
          url: "/_next/static/eODf_NhSJAsbEKppnLrxk/_ssgManifest.js",
          revision: "b6652df95db52feb4daf4eca35380933",
        },
        {
          url: "/_next/static/media/4cf2300e9c8272f7-s.p.woff2",
          revision: "18bae71b1e1b2bb25321090a3b563103",
        },
        {
          url: "/_next/static/media/747892c23ea88013-s.woff2",
          revision: "a0761690ccf4441ace5cec893b82d4ab",
        },
        {
          url: "/_next/static/media/8d697b304b401681-s.woff2",
          revision: "cc728f6c0adb04da0dfcb0fc436a8ae5",
        },
        {
          url: "/_next/static/media/93f479601ee12b01-s.p.woff2",
          revision: "da83d5f06d825c5ae65b7cca706cb312",
        },
        {
          url: "/_next/static/media/9610d9e46709d722-s.woff2",
          revision: "7b7c0ef93df188a852344fc272fc096b",
        },
        {
          url: "/_next/static/media/ba015fad6dcf6784-s.woff2",
          revision: "8ea4f719af3312a055caf09f34c89a77",
        },
        { url: "/file.svg", revision: "d09f95206c3fa0bb9bd9fefabfd0ea71" },
        { url: "/globe.svg", revision: "2aaafa6a49b6563925fe440891e32717" },
        {
          url: "/images/flow.jpg",
          revision: "4faace10136d8ef20e55bbe6b4c11210",
        },
        {
          url: "/images/flow1.jpg",
          revision: "0a17d049776d7295be739f4357c954ae",
        },
        {
          url: "/images/hero3.jpg",
          revision: "9a1c9cea1fb3f88822adffa237a90227",
        },
        {
          url: "/images/login.jpg",
          revision: "70822d9baff79c5696ecc0bbc3982fa4",
        },
        {
          url: "/images/logo.png",
          revision: "1380d803eb859b2642123a9cf834010f",
        },
        {
          url: "/images/problem1.jpg",
          revision: "d5561e032bad19d1a6c4f7a9e452714f",
        },
        {
          url: "/images/solution.jpg",
          revision: "ee9e5be4f5cd3e805e59117ce7cf8220",
        },
        { url: "/kms.svg", revision: "5eae3af798cc1c44243dafc8c965c258" },
        { url: "/logo.png", revision: "a850763ed3aea3584d63b231a4983771" },
        { url: "/manifest.json", revision: "1c1055606b1b6faefa68fd2f3ce42c12" },
        { url: "/next.svg", revision: "8e061864f388b47f33a1c3780831193e" },
        { url: "/vercel.svg", revision: "c0af2f507b369b085b35ef4bbe3bcf1e" },
        { url: "/window.svg", revision: "a2760511c65806022ad20adf74370ff3" },
      ],
      { ignoreURLParametersMatching: [] },
    ),
    e.cleanupOutdatedCaches(),
    e.registerRoute(
      "/",
      new e.NetworkFirst({
        cacheName: "start-url",
        plugins: [
          {
            cacheWillUpdate: async ({
              request: e,
              response: a,
              event: s,
              state: i,
            }) =>
              a && "opaqueredirect" === a.type
                ? new Response(a.body, {
                    status: 200,
                    statusText: "OK",
                    headers: a.headers,
                  })
                : a,
          },
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /^https?.*\/api\/.*/i,
      new e.StaleWhileRevalidate({
        cacheName: "api-cache",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 50, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ));
});
