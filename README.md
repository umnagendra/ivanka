# ivanka
[![Build Status](https://travis-ci.org/umnagendra/ivanka.svg?branch=master)](https://travis-ci.org/umnagendra/ivanka)

A intelligent chat bot using the Facebook Messenger platform that integrates with a contact center.

Ivanka is more than a wrapper/integration point to an existing contact center. She has built-in "smarts" (_read:_ extendable) that enable her to do things like:
* Ask/Gather information interactively about a problem statement
* Dip into an existing knowledge base to answer/resolve the problem reported
* If no contact center agents are available (offline hours/weekend etc.), switch from a chat to a _"request callback"_ mode.
* Translate automatically from one language to another
* etc...

##Built With
* [Node.js](https://nodejs.org/)
* [Facebook Messenger Platform](https://developers.facebook.com/docs/messenger-platform)
* [Cisco Spark Care](https://developer.cisco.com/site/collaboration/)
* :blue_heart:

##Design
![Screenshot](seq.png)

##Running
### Infrastructure
This app can be hosted on [Heroku](https://www.heroku.com/) (see [Procfile](Procfile)), although it is entirely possible to host this anywhere as long as:
* webhooks exposed by this app instance can be invoked from facebook messenger cloud
* this app is able to invoke Cisco Spark Care APIs

### Setup
#### Facebook Messenger Bot
See the [Getting Started](https://developers.facebook.com/docs/messenger-platform/guides/setup) guides by Facebook on how to create a facebook app (bot), acquire required tokens etc.

#### Cisco Spark Care™
Contact a Cisco Contact Center partner, or reach out to [Cisco Spark Dev Support](https://support.ciscospark.com/) to get on-boarded with a Cisco Spark organization.

### Run
1. Customize your [config.json](conf/config.json) to provide specific details such as your facebook page access token, and specifics of your Cisco Spark™ organization etc.

2. Deploy the app with the customized config. New incoming messages (via facebook messenger) addressed to your registered facebook page will result in the bot flow being triggered. 

##Licenses
__MIT License__

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

__External Licenses__

Cisco®, Cisco Spark™, Spark Care™, Cisco SocialMiner® etc. are registered trademarks of [Cisco Systems, Inc.](http://www.cisco.com/web/siteassets/legal/trademark.html)

##About
Originally developed in December 2016 A.D.

###Authors
* [Nagendra Mahesh](https://github.com/umnagendra)
* [S M Mahesh](mailto:smahesh@cisco.com)
