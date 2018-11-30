// tslint:disable:max-line-length
import * as mapper from "./mapper";

const INDEXED_REACT_NODE = {
  id: "react",
  link: "//react",
  score: 0,
  isNew: false
};

const INDEXED_REDUX_NODE = {
  id: "redux",
  link: "//redux",
  score: 1,
  isNew: false
};

describe("mapParsedTweetToComment", () => {
  test.each([
    [
      {
        id: "12345678",
        text: "the text",
        creatorId: "1111",
        creatorUsername: "@Foo",
        timestampMs: "2222",
        comment: "the comment",
        tailNodeId: "react",
        headNodeId: "redux"
      },
      {
        tailNode: INDEXED_REACT_NODE,
        headNode: INDEXED_REDUX_NODE
      },
      {
        id: "12345678",
        comment: "the comment",
        source: "twitter",
        sourceLink: "https://twitter.com/@Foo/status/12345678",
        sourceUserId: "@Foo",
        timestampMs: "2222",
        tailNode: INDEXED_REACT_NODE,
        headNode: INDEXED_REDUX_NODE
      }
    ]
  ])(
    "should map tweet %o with parsed result %o and node search result %o to %o",
    (parsedTweet, nodeSearchResult, expected) => {
      const actual = mapper.mapParsedTweetToComment(
        parsedTweet,
        nodeSearchResult
      );
      expect(actual).toEqual(expected);
    }
  );
});

describe("mapTweetToTweetCreated", () => {
  test.each([
    [
      {
        created_at: "Mon Sep 03 10:02:06 +0000 2018",
        id: 1036554921464815600,
        id_str: "1036554921464815616",
        text:
          "@BecauseNpm recompose to recompact b/c compacts a chain of HOCs into a single HOC, resulting in a flatter React tre… https://t.co/39MflXuODI",
        truncated: true,
        entities: {
          hashtags: [],
          symbols: [],
          user_mentions: [
            {
              screen_name: "BecauseNpm",
              name: "BecauseNpm",
              id: 1034797758107009000,
              id_str: "9999999999999999999",
              indices: [0, 11]
            }
          ],
          urls: [
            {
              url: "https://t.co/39MflXuODI",
              expanded_url:
                "https://twitter.com/i/web/status/1036554921464815616",
              display_url: "twitter.com/i/web/status/1…",
              indices: [117, 140]
            }
          ]
        },
        in_reply_to_status_id: null,
        in_reply_to_status_id_str: null,
        in_reply_to_user_id: 1034797758107009000,
        in_reply_to_user_id_str: "9999999999999999999",
        in_reply_to_screen_name: "BecauseNpm",
        user: {
          id: 1034797758107009000,
          id_str: "9999999999999999999",
          name: "BecauseNpm",
          screen_name: "BecauseNpm",
          location: "",
          description: "",
          url: null,
          entities: { description: { urls: [] } },
          protected: false,
          followers_count: 0,
          friends_count: 1,
          listed_count: 0,
          created_at: "Wed Aug 29 13:39:45 +0000 2018",
          favourites_count: 1,
          utc_offset: null,
          time_zone: null,
          geo_enabled: false,
          verified: false,
          statuses_count: 7,
          lang: "en",
          contributors_enabled: false,
          is_translator: false,
          is_translation_enabled: false,
          profile_background_color: "F5F8FA",
          profile_background_image_url: null,
          profile_background_image_url_https: null,
          profile_background_tile: false,
          profile_image_url:
            "http://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png",
          profile_image_url_https:
            "https://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png",
          profile_link_color: "1DA1F2",
          profile_sidebar_border_color: "C0DEED",
          profile_sidebar_fill_color: "DDEEF6",
          profile_text_color: "333333",
          profile_use_background_image: true,
          has_extended_profile: false,
          default_profile: true,
          default_profile_image: true,
          following: null,
          follow_request_sent: null,
          notifications: null,
          translator_type: "none"
        },
        geo: null,
        coordinates: null,
        place: null,
        contributors: null,
        is_quote_status: false,
        retweet_count: 0,
        favorite_count: 0,
        favorited: false,
        retweeted: false,
        lang: "en"
      },
      {
        id: "1036554921464815616",
        text: "",
        creatorId: "9999999999999999999",
        creatorUsername: "BecauseNpm",
        timestampMs: "1535968926000"
      }
    ],
    [
      {
        created_at: "Thu Oct 18 07:36:44 +0000 2018",
        id: 1.0528257941443e18,
        id_str: "1052825794144337920",
        text: "@BecauseNpm test tweet",
        truncated: false,
        in_reply_to_status_id: null,
        in_reply_to_status_id_str: null,
        in_reply_to_user_id: 1.034797758107e18,
        in_reply_to_user_id_str: "9999999999999999999",
        in_reply_to_screen_name: "BecauseNpm",
        user: {
          id: 2359714072,
          id_str: "2359714072",
          name: "joseph holder",
          screen_name: "JosephKl95",
          location: null,
          url: null,
          description: null,
          translator_type: "none",
          protected: false,
          verified: false,
          followers_count: 6,
          friends_count: 125,
          listed_count: 1,
          favourites_count: 1,
          statuses_count: 3,
          created_at: "Sat Feb 22 23:37:29 +0000 2014",
          utc_offset: null,
          time_zone: null,
          geo_enabled: false,
          lang: "en-GB",
          contributors_enabled: false,
          is_translator: false,
          profile_background_color: "C0DEED",
          profile_background_image_url:
            "http://abs.twimg.com/images/themes/theme1/bg.png",
          profile_background_image_url_https:
            "https://abs.twimg.com/images/themes/theme1/bg.png",
          profile_background_tile: false,
          profile_link_color: "1DA1F2",
          profile_sidebar_border_color: "C0DEED",
          profile_sidebar_fill_color: "DDEEF6",
          profile_text_color: "333333",
          profile_use_background_image: true,
          profile_image_url:
            "http://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png",
          profile_image_url_https:
            "https://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png",
          default_profile: true,
          default_profile_image: false,
          following: null,
          follow_request_sent: null,
          notifications: null
        },
        geo: null,
        coordinates: null,
        place: null,
        contributors: null,
        is_quote_status: false,
        quote_count: 0,
        reply_count: 0,
        retweet_count: 0,
        favorite_count: 0,
        entities: {
          hashtags: [],
          urls: [],
          user_mentions: [
            {
              screen_name: "BecauseNpm",
              name: "BecauseNpm",
              id: 1.034797758107e18,
              id_str: "9999999999999999999",
              indices: [0, 11]
            }
          ],
          symbols: []
        },
        favorited: false,
        retweeted: false,
        filter_level: "low",
        lang: "fr",
        timestamp_ms: "1539848204538"
      },
      {
        id: "1052825794144337920",
        text: "@BecauseNpm test tweet",
        creatorId: "2359714072",
        creatorUsername: "JosephKl95",
        timestampMs: "1539848204000"
      }
    ]
  ])("should map tweet %o to message %o", (tweet, expected) => {
    const actual = mapper.mapTweetToTweetCreated(tweet);
    expect(actual).toEqual(expected);
  });
});

describe("parseTweetStatusResponse", () => {
  test.each([
    [
      {
        data: {
          created_at: "Mon Sep 03 10:02:06 +0000 2018",
          id: 1.0365549214648e18,
          id_str: "1036554921464815616",
          full_text:
            "@BecauseNpm recompose to recompact b/c compacts a chain of HOCs into a single HOC, resulting in a flatter React tree. Largely a drop-in replacement.",
          truncated: false,
          display_text_range: [0, 148],
          entities: {
            hashtags: [],
            symbols: [],
            user_mentions: [
              {
                screen_name: "BecauseNpm",
                name: "BecauseNpm",
                id: 1.034797758107e18,
                id_str: "9999999999999999999",
                indices: [0, 11]
              }
            ],
            urls: []
          },
          in_reply_to_status_id: null,
          in_reply_to_status_id_str: null,
          in_reply_to_user_id: 1.034797758107e18,
          in_reply_to_user_id_str: "9999999999999999999",
          in_reply_to_screen_name: "BecauseNpm",
          user: {
            id: 1.034797758107e18,
            id_str: "9999999999999999999",
            name: "BecauseNpm",
            screen_name: "BecauseNpm",
            location: "",
            description: "",
            url: null,
            entities: {
              description: {
                urls: []
              }
            },
            protected: false,
            followers_count: 0,
            friends_count: 1,
            listed_count: 0,
            created_at: "Wed Aug 29 13:39:45 +0000 2018",
            favourites_count: 1,
            utc_offset: null,
            time_zone: null,
            geo_enabled: false,
            verified: false,
            statuses_count: 7,
            lang: "en",
            contributors_enabled: false,
            is_translator: false,
            is_translation_enabled: false,
            profile_background_color: "F5F8FA",
            profile_background_image_url: null,
            profile_background_image_url_https: null,
            profile_background_tile: false,
            profile_image_url:
              "http://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png",
            profile_image_url_https:
              "https://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png",
            profile_link_color: "1DA1F2",
            profile_sidebar_border_color: "C0DEED",
            profile_sidebar_fill_color: "DDEEF6",
            profile_text_color: "333333",
            profile_use_background_image: true,
            has_extended_profile: false,
            default_profile: true,
            default_profile_image: true,
            following: null,
            follow_request_sent: null,
            notifications: null,
            translator_type: "none"
          },
          geo: null,
          coordinates: null,
          place: null,
          contributors: null,
          is_quote_status: false,
          retweet_count: 0,
          favorite_count: 0,
          favorited: false,
          retweeted: false,
          lang: "en"
        }
      },
      {
        id: "1036554921464815616",
        text:
          "@BecauseNpm recompose to recompact b/c compacts a chain of HOCs into a single HOC, resulting in a flatter React tree. Largely a drop-in replacement.",
        creatorId: "9999999999999999999",
        creatorUsername: "BecauseNpm",
        timestampMs: "1535968926000"
      }
    ],
    [
      {
        data: {
          created_at: "Mon Sep 03 10:02:06 +0000 2018",
          id: 1036554921464815600,
          id_str: "1036554921464815616",
          text:
            "@BecauseNpm recompose to recompact b/c compacts a chain of HOCs into a single HOC, resulting in a flatter React tre… https://t.co/39MflXuODI",
          truncated: true,
          entities: {
            hashtags: [],
            symbols: [],
            user_mentions: [
              {
                screen_name: "BecauseNpm",
                name: "BecauseNpm",
                id: 1034797758107009000,
                id_str: "9999999999999999999",
                indices: [0, 11]
              }
            ],
            urls: [
              {
                url: "https://t.co/39MflXuODI",
                expanded_url:
                  "https://twitter.com/i/web/status/1036554921464815616",
                display_url: "twitter.com/i/web/status/1…",
                indices: [117, 140]
              }
            ]
          },
          in_reply_to_status_id: null,
          in_reply_to_status_id_str: null,
          in_reply_to_user_id: 1034797758107009000,
          in_reply_to_user_id_str: "9999999999999999999",
          in_reply_to_screen_name: "BecauseNpm",
          user: {
            id: 1034797758107009000,
            id_str: "9999999999999999999",
            name: "BecauseNpm",
            screen_name: "BecauseNpm",
            location: "",
            description: "",
            url: null,
            entities: { description: { urls: [] } },
            protected: false,
            followers_count: 0,
            friends_count: 1,
            listed_count: 0,
            created_at: "Wed Aug 29 13:39:45 +0000 2018",
            favourites_count: 1,
            utc_offset: null,
            time_zone: null,
            geo_enabled: false,
            verified: false,
            statuses_count: 7,
            lang: "en",
            contributors_enabled: false,
            is_translator: false,
            is_translation_enabled: false,
            profile_background_color: "F5F8FA",
            profile_background_image_url: null,
            profile_background_image_url_https: null,
            profile_background_tile: false,
            profile_image_url:
              "http://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png",
            profile_image_url_https:
              "https://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png",
            profile_link_color: "1DA1F2",
            profile_sidebar_border_color: "C0DEED",
            profile_sidebar_fill_color: "DDEEF6",
            profile_text_color: "333333",
            profile_use_background_image: true,
            has_extended_profile: false,
            default_profile: true,
            default_profile_image: true,
            following: null,
            follow_request_sent: null,
            notifications: null,
            translator_type: "none"
          },
          geo: null,
          coordinates: null,
          place: null,
          contributors: null,
          is_quote_status: false,
          retweet_count: 0,
          favorite_count: 0,
          favorited: false,
          retweeted: false,
          lang: "en"
        }
      },
      null
    ]
  ])("should parse %o as %o", (response, expected) => {
    if (!expected) {
      expect(() => mapper.mapTweetStatusResponse(response)).toThrow(
        /\[400\] Tweet is not valid/
      );
    } else {
      const actual = mapper.mapTweetStatusResponse(response);
      expect(actual).toEqual(expected);
    }
  });
});
