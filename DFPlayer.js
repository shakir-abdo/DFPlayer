/*
 Copyright (c) 2021 shakir abdo. See the file LICENSE for copying permission
 This module is a wrapper code for  DFPlayer mini module
 more info: https://wiki.dfrobot.com/DFPlayer_Mini_SKU_DFR0299

 here is some information about possible values:

 EQ
  -Normal: 0,
  -Pop: 1,
  -Rock: 2,
  -Jazz: 3,
  -Classic: 4,
  -Bass: 5

 Mode
  -Repeat: 0,
  -FolderRepeat: 1,
  -SingleRepeat: 2,
  -Random: 3

 Source
  -U: 0,
  -TF: 1,
  -AUX: 2,
  -Sleep: 3,
  -Flash: 4
*/
var C = {
  START_BYTE: 0x7e,
  END_BYTE: 0xef,
  VERSION_BYTE: 0xff,
  DATA_LENGTH: 0x06,
  REQUEST_ACK: null
};

var Command = {
  Play: 13,
  Next: 1,
  SetEQ: 7,
  Reset: 12,
  Pause: 14,
  Resume: 11,
  SetMode: 8,
  Standby: 10,
  SetGain: 16,
  QueryEQ: 68,
  Previous: 2,
  SetTrack: 3,
  SetVolume: 6,
  SetSource: 9,
  QueryMode: 69,
  SetFolder: 15,
  RepeatPlay: 17,
  QueryVolume: 67,
  QueryStatus: 66,
  IncreaseVolume: 4,
  DecreaseVolume: 5,
  QuerySoftwareVersion: 70,
  QueryTotalFilesOnUDisk: 72,
  QueryTotalFilesOnFlash: 73,
  QueryTotalFilesOnTFCard: 71,
  QueryCurrentTrackOnUDisk: 76,
  QueryCurrentTrackOnFlash: 77,
  QueryCurrentTrackOnTFCard: 75
};
var utils = {
    parseByte: function (byte) {
    var value = parseInt(byte, 16);
    return byte + " (" + value + ")";
  },
  getHighByte: function (checksum) {
    return checksum >> 8;
  },
  getLowByte: function (checksum) {
    return checksum & 0xff;
  },
  toBytes: function (value) {
    return [utils.getHighByte(value), utils.getLowByte(value)];
  }
}
function DFPlayer(tx, rx) {
  this.tx = tx;
  this.rx = rx;
  C.REQUEST_ACK = rx ? 0x01 : 0x00;
  this.serial = new Serial();
  this.buffer = "";
  this.calculateChecksum = function (command, p1, p2) {
    return -(
      C.VERSION_BYTE +
      C.DATA_LENGTH +
      command +
      C.REQUEST_ACK +
      p1 +
      p2
    );
  };
  this.sendCommand = function (command, value) {
    if (value === void 0) {
      value = 0;
    }
    var _a = utils.toBytes(value),
      p1 = _a[0],
      p2 = _a[1];
    var checksum = this.calculateChecksum(command, p1, p2);
    var payload = [
      C.START_BYTE,
      C.VERSION_BYTE,
      C.DATA_LENGTH,
      command,
      C.REQUEST_ACK,
      p1,
      p2,
      utils.getHighByte(checksum),
      utils.getLowByte(checksum),
      C.END_BYTE
    ];
    this.serial.write(payload);
  };
    this.serial.setup(9600, { tx: tx, rx: rx });
    this.serial.on("data", function (data) {
      this.buffer += data;
      while (this.buffer.length >= 10) {
        var packet = this.buffer
          .slice(0, 10)
          .split("")
          .map(function (x) {
            return (256 + x.charCodeAt(0))
              .toString(16)
              .substr(-2)
              .toUpperCase();
          });
        this.buffer = this.buffer.slice(10);
        console.log("Returned: 0x" + utils.parseByte(packet[3]));
        console.log("Parameter: 0x" + utils.parseByte(packet[5]) + ", 0x" + utils.parseByte(packet[6]));
      }
    });
}
DFPlayer.prototype.playNext = function () {
  this.sendCommand(Command.Next);
}
  DFPlayer.prototype.playPrevious = function () {
    this.sendCommand(Command.Previous);
  }
  DFPlayer.prototype.increaseVolume = function () {
    this.sendCommand(Command.IncreaseVolume);
  }
  DFPlayer.prototype.decreaseVolume = function () {
    this.sendCommand(Command.DecreaseVolume);
  }
  DFPlayer.prototype.volume = function (volume) {
    if (typeof volume !== "undefined") {
      this.sendCommand(Command.SetVolume, volume);
    } else {
      this.sendCommand(Command.QueryVolume);
    }
  }
  DFPlayer.prototype.eq = function (genre) {
    if (typeof genre !== "undefined") {
      sendCommand(Command.SetEQ, genre);
    } else {
      sendCommand(Command.QueryEQ);
    }
    sendCommand(Command.SetEQ, genre);
  }
  DFPlayer.prototype.mode = function (mode) {
    if (typeof mode !== "undefined") {
      this.sendCommand(Command.SetMode, mode);
    } else {
      this.sendCommand(Command.QueryMode);
    }
  }
  DFPlayer.prototype.setSource = function (source) {
    this.sendCommand(Command.SetSource, source);
  }
  DFPlayer.prototype.standby = function () {
    this.sendCommand(Command.Standby);
  }
  DFPlayer.prototype.resume = function () {
    this.sendCommand(Command.Resume);
  }
  DFPlayer.prototype.reset = function () {
    this.sendCommand(Command.Reset);
  }
  DFPlayer.prototype.play = function (trackNumber) {
    if (typeof trackNumber !== "undefined") {
      this.sendCommand(Command.SetTrack, trackNumber);
    } else {
      this.sendCommand(Command.Play);
    }
  }
  DFPlayer.prototype.pause = function () {
    this.sendCommand(Command.Pause);
  }
  DFPlayer.prototype.setPlaybackFolder = function (folder) {
    var f = Math.max(1, Math.min(10, folder));
    this.sendCommand(Command.SetFolder, f);
  }
  DFPlayer.prototype.setGain = function (gain) {
    var g = Math.max(0, Math.min(31, gain));
    this.sendCommand(Command.SetGain, g);
  }
  DFPlayer.prototype.setRepeat = function (repeat) {
    if (repeat === void 0) {
      repeat = false;
    }
    this.sendCommand(Command.RepeatPlay, Number(repeat));
  }
  DFPlayer.prototype.getStatus = function () {
    sendCommand(Command.QueryStatus);
  }
  DFPlayer.prototype.getSoftwareVersion = function () {
    this.sendCommand(Command.QuerySoftwareVersion);
  }
  DFPlayer.prototype.getTotalFilesOnTFCard =
    function queryTotalFilesOnTFCard() {
      this.sendCommand(Command.QueryTotalFilesOnTFCard);
    }
  DFPlayer.prototype.getTotalFilesOnUDisk = function () {
    this.sendCommand(Command.QueryTotalFilesOnUDisk);
  }
  DFPlayer.prototype.getTotalFilesOnFlash = function () {
    this.sendCommand(Command.QueryTotalFilesOnFlash);
  }
  DFPlayer.prototype.getCurrentTrackOnTFCard =
    function() {
      this.sendCommand(Command.QueryCurrentTrackOnTFCard);
    }
  DFPlayer.prototype.getCurrentTrackOnUDisk =
    function () {
      this.sendCommand(Command.QueryCurrentTrackOnUDisk);
    }
  DFPlayer.prototype.getCurrentTrackOnFlash =
    function () {
      this.sendCommand(Command.QueryCurrentTrackOnFlash);
    };
exports.setup = function (tx, rx) {
  return new DFPlayer(tx, rx);
};
