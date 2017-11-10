# Dumb Discord Bot

## Abstract
The dumb discord bot is a service designed to run as a bot for discord servers (Redundant). This bot is designed to play random sounds and make random posts when a user requests it. Honestly, there is little to no point in this service, and it will most likely benefit nobody. 

 ## Requirements
*	The dumb discord bot shall be a service
*	The dumb discord bot shall incorporate a logging service
*	The dumb discord bot shall incorporate configuration and error checking on startup
*	The dumb discord bot shall be a good bot
*	The dumb discord bot may pick images and sounds at random to play or post
*	When the dumb discord bot reads the command !rando, it shall randomly select a sound to play
*	When the dumb discord bot reads the command !stop, it shall stop all currently playing sounds
*	When the dumb discord bot reads the command !alarm <24 hour time>, it shall set an alarm for the specified time
    *	When the specified time is at or above the set alarm time, the dumb discord bot shall sound an alarm sound
*	The dumb discord server shall play Danny Devito saying “HOORS” when the command !hoors is typed
*	The client ID shall be specified through a configuration file or passed argument on startup

## Release Plan
1. Phase 1 - Service structure and basic sound playing abilities
    * Interopablity between server and discord
    * Bootable serivce
        * Boot up self check
        * Start discord service
    * Logging
2. Phase 2 - Business Intelligence 
3. Phase 3 - Form S-corp and go public
4. Phase 4 - Make lods-of-emone

## Kick Off Schedule
11/9/2017 - The kick off will include me [drinking a PBR](https://i.imgur.com/6kaIJCj.jpg). Possibly wild turkey. 

## Stakeholders 
* Customers (Discord users)
* US Govt, probably

## Members
* dot1q

- - - -

## Architecture

### Overview
This section aims to address the various types of components and data flows that the dumb discord bot will utilize. The dumb discord bot will be built with various enviornments in mind, and aim to be utilized on ARM, x86/x64 Linux and Windows Systems. The image below explains the various components and their connections. 

![picture](https://i.imgur.com/0geEFBt.png)


### Stack
1. Discord Client (Application/Presentation)
2. Discord API (Transport)
3. Dumb Discord Bot Controller (transport protocol not currently present)
4. Back End Services

### Dev Environment
The development environment will consist of using nodeJS and gulp.

To set up a dev environment:
1. Install latest versions of nodeJS and NPM
2. clone git repo
    2a. If using a windows machine execute ```npm install --global --production windows-build-tools```
3. Execute ```npm install```

The following gulp commands
* ```gulp clean```
* ```gulp copy```
* ```gulp build```
* ```gulp serve```

