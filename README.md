
# DFPlayer

This is an espruino  module for [DFPlayer mini](https://wiki.dfrobot.com/DFPlayer_Mini_SKU_DFR0299)
This module uses [Software Serial](https://www.espruino.com/EspruinoESP8266#software-serial)

i tested on [ESP8266 NodeMCU](https://en.wikipedia.org/wiki/NodeMCU#:~:text=NodeMCU%20is%20a%20low%2Dcost,32%2Dbit%20MCU%20was%20added.).


## usage

require the module, and set your tx and rx pins.

```javascript
  var dfplayer = require("DFPlayer");
  var mp3 = dfplayer.setup(NodeMCU.D2, NodeMCU.D1); //tx, rx
```
### Then you can call the method you want
play a song
```javascript
    mp3.play();
```
### Available functions:
 - Play
 - Next
 - SetEQ
 - Reset
 - Pause
 - Resume
 - SetMode
 - Standby
 - SetGain
 - QueryEQ
 - Previous
 - SetTrack
 - SetVolume
 - SetSource
 - QueryMode
 - SetFolder
 - RepeatPlay
 - QueryVolume
 - QueryStatus
 - IncreaseVolume
 - DecreaseVolume
 - QuerySoftwareVersion
 - QueryTotalFilesOnUDisk
 - QueryTotalFilesOnFlash
 - QueryTotalFilesOnTFCard
 - QueryCurrentTrackOnUDisk
 - QueryCurrentTrackOnFlash
 - QueryCurrentTrackOnTFCard



## Contributing

feel free to improve the code

