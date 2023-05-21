# Dash Crash (Project Explore 1 - WS 2021/22)

Dies ist unser Projekt im Rahmen des Project Explore 1 zum Wintersemester 2021/22 im Studiengang
Code & Context an der TH Köln

- Es handelt sich hier um ein Dashboard, welches zur Visualisierung von globalen Feuern, dem Wetter
  und der Luftqualität am Standort des Nutzers dient.
- Wenn das Projekt im Browser geöffnet wird ist aufgrund einer API, welche auf die Koordinaten des Users
  zugreift [eine Browserextension notwendig](https://www.moesif.com/blog/technical/cors/Authoritative-Guide-to-CORS-Cross-Origin-Resource-Sharing-for-REST-APIs/)

## Datenquellen

Hier unsere zentralen Themen und Datenquellen.

- Feuer
  - [NASA FIRMS API](https://firms.modaps.eosdis.nasa.gov/api/area/), welche Daten zu globalen Feuern wiedergibt:
- Wetter
  - [Openweather API](https://openweathermap.org/current), welche Daten zum Wetter wiedergibt:
- Luftqualität
  - [API](https://waqi.info/de/), welche Luftqualität an verschiedenen Standorten ausgibt:
- Position des Client
  - [API](https://pickpoint.io/api-reference), welche die geographischen Daten des Nutzers wiedergibt:
