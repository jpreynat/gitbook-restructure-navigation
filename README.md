# gitbook-structured-toc
A module for Gitbook that restructures the navigation, switching places between navigation items.
This is necessary if you want to move another page before the introduction / readme page.

Configuration (in book.json):

    "plugins": [
      "restructure-navigation"
    ],
    "pluginsConfig": {
      "gitbook-restructure-navigation": {
        "transformations": [
          {
            "from": 0,
            "to": 1
          }
        ]
      }
    }
