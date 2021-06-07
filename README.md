# HA Dashboard

A custom dashboard for Home Assistant with sidebar

[![GitHub Release][releases-shield]][releases]
[![License][license-shield]](LICENSE.md)

![Image of Dashboard](https://github.com/wassy92x/lovelace-ha-dashboard/blob/master/.images/ha-dashboard.png?raw=true)

## Options

| Name              | Type    | Requirement  | Description                                 | Default             |
| ----------------- | ------- | ------------ | ------------------------------------------- | ------------------- |
| type              | string  | **Required** | `custom:ha-dashboard`                       |                     |
| cards             | object[]| **Optional** | Cards to show                               |                     |
| title             | string  | **Optional** | Title to show in tab                        |                     |
| icon              | string  | **Optional** | Icon to show in tab                         |                     |
| badges            | object[]| **Optional** | Badges to show                              |                     |
| theme             | string  | **Optional** | Theme to use for view                       |                     |
| background        | string  | **Optional** | Background of view                          |                     |
| usePanel          | boolean | **Optional** | Give complete space to one card             | false               |
| sidebar           | object  | **Optional** | Configuration of sidebar                    |                     |

### Sidebar Options

| Name              | Type    | Requirement  | Description                                 | Default             |
| ----------------- | ------- | ------------ | ------------------------------------------- | ------------------- |
| cards             | object[]| **Optional** | Cards to show                               |                     |
| stickyCards       | object[]| **Optional** | Cards to show always on top (don't scroll)  |                     |
| buttons           | object[]| **Optional** | Customize style of dashboard and cards      |                     |

#### Button Options

| Name              | Type    | Requirement  | Description                                 | Default             |
| ----------------- | ------- | ------------ | ------------------------------------------- | ------------------- |
| icon              | string  | **Required** | Icon of button                              |                     |
| label             | string  | **Optional** | Label of button                             |                     |
| action            | object  | **Optional** | Action to perform on click etc.             |                     |

## Action Options

| Name            | Type   | Requirement  | Description                                                                                                                            | Default     |
| --------------- | ------ | ------------ | -------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| action          | string | **Required** | Action to perform (more-info, toggle, call-service, navigate url, none)                                                                | `more-info` |
| navigation_path | string | **Optional** | Path to navigate to (e.g. /lovelace/0/) when action defined as navigate                                                                | `none`      |
| url             | string | **Optional** | URL to open on click when action is url. The URL will open in a new tab                                                                | `none`      |
| service         | string | **Optional** | Service to call (e.g. media_player.media_play_pause) when action defined as call-service                                               | `none`      |
| service_data    | object | **Optional** | Service data to include (e.g. entity_id: media_player.bedroom) when action defined as call-service                                     | `none`      |
| haptic          | string | **Optional** | Haptic feedback for the [Beta IOS App](http://home-assistant.io/ios/beta) _success, warning, failure, light, medium, heavy, selection_ | `none`      |
| repeat          | number | **Optional** | How often to repeat the `hold_action` in milliseconds.                                                                                 | `non`       |

# Styling
The dashboard is stylable by some css variables.
| Name                 | Description                                 | Default                   |
| -------------------- | ------------------------------------------- | ------------------------- |
| --sidebar-background | Background of sidebar                       | background color of cards |

# Note
The sidebar is responsive and scales between 300px width and 500px.
If screen is smaller than 1024px the sidebar will be hidden (for example on the most mobile phones)

# Example
```
views:
  - title: Kiosk
    path: kiosk
    background: center / cover no-repeat url("/local/img/background.png") fixed
    type: custom:ha-dashboard
    badges:
      - entity: person.fabian
    sidebar:
      buttons:
        - icon: mdi:information
          action:
            action: call-service
            service: myservice.action
      stickyCards:
        - type: custom:digital-clock
      cards:
        - type: weather-forecast
          entity: weather.frankfurt_openweathermap
    cards:
      - type: entities
        entities:
         - climate.wohnzimmer
        title: Wohnzimmer
```

[license-shield]: https://img.shields.io/github/license/wassy92x/lovelace-ha-dashboard.svg?style=for-the-badge
[releases-shield]: https://img.shields.io/github/release/wassy92x/lovelace-ha-dashboard.svg?style=for-the-badge
[releases]: https://github.com/wassy92x/lovelace-ha-dashboard/releases
