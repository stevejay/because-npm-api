import * as mapper from "./mapper";

describe("mapSearchResponse", () => {
  test.each([
    [
      {
        objects: [],
        total: 0,
        time: "Mon Oct 29 2018 21:52:26 GMT+0000 (UTC)"
      },
      "react",
      null
    ],
    [
      {
        objects: [
          {
            package: {
              name: "react",
              description:
                "React is a JavaScript library for building user interfaces.",
              links: {
                npm: "https://www.npmjs.com/package/react",
                homepage: "https://reactjs.org/",
                repository: "https://github.com/facebook/react",
                bugs: "https://github.com/facebook/react/issues"
              }
            },
            score: {
              detail: {
                popularity: 0.7685461595016623
              }
            }
          },
          {
            package: {
              name: "react-redux",
              description: "Official React bindings for Redux",
              links: {
                npm: "https://www.npmjs.com/package/react-redux",
                homepage: "https://github.com/reduxjs/react-redux",
                repository: "https://github.com/reduxjs/react-redux",
                bugs: "https://github.com/reduxjs/react-redux/issues"
              }
            },
            score: {
              detail: {
                popularity: 0.7852539879028508
              }
            }
          }
        ]
      },
      "react",
      {
        id: "react",
        description:
          "React is a JavaScript library for building user interfaces.",
        link: "https://www.npmjs.com/package/react",
        score: 0.7685461595016623,
        isNew: true
      }
    ],
    [
      {
        objects: [
          {
            package: {
              name: "@foo/react",
              links: {
                npm: "https://www.npmjs.com/package/react"
              }
            },
            score: {
              detail: {
                popularity: 0.7685461595016623
              }
            }
          }
        ]
      },
      "@foo/react",
      {
        id: "@foo/react",
        description: null,
        link: "https://www.npmjs.com/package/react",
        score: 0.7685461595016623,
        isNew: true
      }
    ],
    [
      {
        objects: [
          {
            package: {
              name: "react-redux",
              description: "Official React bindings for Redux",
              links: {
                npm: "https://www.npmjs.com/package/react-redux",
                homepage: "https://github.com/reduxjs/react-redux",
                repository: "https://github.com/reduxjs/react-redux",
                bugs: "https://github.com/reduxjs/react-redux/issues"
              }
            },
            score: {
              detail: {
                popularity: 0.7852539879028508
              }
            }
          }
        ]
      },
      "react",
      null
    ]
  ])("%o should map to %o", (response, id, expected) => {
    const actual = mapper.mapSearchResponse(response, id);
    expect(actual).toEqual(expected);
  });
});
