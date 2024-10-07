# WeatherStar 3000+

A live version of this project is available at https://weatherstar3000.netbymatt.com

## About

This project aims to bring back the feel of the 80's with a weather forecast that has the look and feel of The Weather Channel at that time but available in a modern way. This is by no means intended to be a perfect emulation of the WeatherStar 3000, the hardware that produced those wonderful blue and white text you saw during the local forecast on The Weather Channel. Instead, this project intends to create a simple to use interface with minimal configuration fuss. Some changes have been made to the screens available because either more or less forecast information is available today than was in the 80's. Most of these changes are captured in sections below.

## Acknowledgements

This project is based on a sister project [Weatherstar 4000+](https://github.com/netbymatt/ws4kp)

* [Mike Battaglia](https://github.com/vbguyny/ws4kp) for the original WeatherStar4000+ code upon which this is loosely based.
* The team at [TWCClassics](https://twcclassics.com/) for several resources.
	* A [font](https://twcclassics.com/downloads.html) set used on the original WeatherStar 3000
	* [Icon](https://twcclassics.com/downloads.html) sets
	* Countless photos and videos of WeatherStar 3000 forecasts used as references.

## Run Your WeatherStar3000
There are a lot of CORS considerations and issues with api.weather.gov that are easiest to deal with by running a local server to see this in action (or use the live link above). You'll need Node.js >18.0 to run the local server.

To run via Node locally:
```
git clone https://github.com/netbymatt/ws3kp.git
cd ws4kp
npm i
node index.js
```

## Sharing a permalink (bookmarking)
Selected displays, the forecast city and widescreen setting are sticky from one session to the next. However if you would like to share your exact configuration or bookmark it click the "Copy Permalink" (or get "Get Parmalink") near the bottom of the page. A URL will be copied to your clipboard with all of you selected displays and location (or copy it from the page if your browser doesn't support clipboard transfers directly). You can then share this link or add it to your bookmarks.

## Kiosk mode
Kiosk mode can be activated by a checkbox on the page. Note that there is no way out of kiosk mode (except refresh or closing the browser), and the play/pause and other controls will not be available. This is deliberate as a browser's kiosk mode it intended not to be exited or significantly modified.

It's also possible to enter kiosk mode using a permalink. First generate a [Permalink](#sharing-a-permalink-bookmarking), then to the end of it add `&kiosk=true`. Opening this link will load all of the selected displays included in the Permalink, enter kiosk mode immediately upon loading and start playing the forecast.

## Customization
A hook is provided as `/server/scripts/custom.js` to allow customizations to your own fork of this project, without accidentally pushing your customizations back upstream to the git repository. An sample file is provided at `/server/scripts/custom.sample.js` and should be renamed to `custom.js` activate it.

## Issue reporting and feature requests

Please do not report issues with api.weather.gov being down. It's a new service and not considered fully operational yet. Before reporting an issue or requesting a feature please consider that this is not intended to be a perfect recreation of the WeatherStar 3000, it's a best effort that fits within what's available from the API and within a web browser.

## Disclaimer

This web site should NOT be used in life threatening weather situations, or be relied on to inform the public of such situations. The Internet is an unreliable network subject to server and network outages and by nature is not suitable for such mission critical use. If you require such access to NWS data, please consider one of their subscription services. The authors of this web site shall not be held liable in the event of injury, death or property damage that occur as a result of disregarding this warning.

The WeatherSTAR 3000 unit and technology is owned by The Weather Channel. This web site is a free, non-profit work by fans. All of the back ground graphics of this web site were created from scratch.  The fonts were originally created by Nick Smith (http://twcclassics.com/downloads/fonts.html).

