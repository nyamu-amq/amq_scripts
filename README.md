# amq_scripts

im so lazy to write usage.... and english is too hard for me..../o\

### [amqAutoReady.user.js](https://github.com/nyamu-amq/amq_scripts/raw/master/amqAutoReady.user.js)
- It changes your state to ready automatically when you are in lobby.
- Even when settings are changed.
- You can unready by clicking unready button manually.
- You can toggle it with [Alt+R]. Default is off.
- Dedicated to lazists.

### [amqAvoidTroubleShooterPopup.user.js](https://github.com/nyamu-amq/amq_scripts/raw/master/amqAvoidTroubleShooterPopup.user.js)
- it prevents trouble shooter popup.
- **DON'T USE THIS SCRIPT UNLESS YOU KNOW WELL WHAT TO DO WHEN BUFFERING PROBLEM HAPPENED**
- [amq official buffering troubleshooter here](https://animemusicquiz.com/troubleshooting), just in case

### [amqBugfix.user.js](https://github.com/nyamu-amq/amq_scripts/raw/master/amqBugfix.user.js)
- it fixes bug that wrong game type on game settings

### [amqChatCommands.user.js](https://github.com/nyamu-amq/amq_scripts/raw/master/amqChatCommands.user.js)
- it enables chat commands
  - commands for host in lobby
    - /t [oei] : change songtype
      - ex) /t oi => openings inserts. /t ei => endings inserts. /t e => endings only.
    - /n (number) : change number of songs
    - /d (number1)-(number2) : change difficulty
      - ex) /d 0-40 => change difficulty to 0-40
    - /random : change song selection to random
    - /watched : change song selection to watched only
    - /s (number) : change speed. amq allow one of 1, 1.5, 2, 4 only
    - /spec (someone) : send someone to spec
    - /kick (someone) : kick someone
    - /host (someone) : give someone host
  - commands for host in game
    - /lb : start a vote for returning to lobby
    - /pause : pause or unpause game
  - commands for everyone in lobby
    - /spec : change to spectator
    - /join : change to player
    - /queue : toggle queue when you are in lobby while game is progressing
  - commands for everyone in game
    - /v (number) : change volume 0-100
    - /skip : skip current song
    - /autothrow (answer) : start throwing with answer automatically. you can stop it by /autothrow without answer
    - **DON'T USE /autothrow COMMAND IN RANKED GAME. YOU MAY GET BANNED FROM GAME IF YOU TRY THIS**

### [amqEmojiAnswer.js](https://github.com/nyamu-amq/amq_scripts/raw/master/amqEmojiAnswer.user.js)
- convert emoji shortcode in answer box when press enter
- it works on room name also now

### ~~amqExpandLibraryAutoplay.user.js~~
- obsolete :runner:
- ~~it plays automatically when you selected a song in expand library~~
- ~~the resolution you selected will be kept when you selected another song (but highest resolution if the resolution is not exist)~~

### [amqFriendOnlineNotifier.user.js](https://github.com/nyamu-amq/amq_scripts/raw/master/amqFriendOnlineNotifier.user.js)
- show notification when your friend is online

### [amqHighlightFriends.user.js](https://github.com/nyamu-amq/amq_scripts/raw/master/amqHighlightFriends.user.js)
- apply color to yourself and friends in scorebox and avatarbox
- apply color to name of yourself and friends on chat
- apply color to join/spec/leave system message on chat
- apply color to name of yourself and friends on spec list
- color settings are available on settings>graphics tab
- you can open player summary window by clicking this ![summaryicon](https://i.imgur.com/ZFLFd2t.png) icon or by pressing scroll lock key
  + it shows some infomation of all players, it shows friends only in ranked game
  + when you click someone, box will be changed to the person's box
- codes that applying colors to friend name on chat and lobby was provided by ensorcell. thanks a lot
- thanks a lot TheJoseph98 for providing window script and mentoring

### [amqHotkeyFunctions.user.js](https://github.com/nyamu-amq/amq_scripts/raw/master/amqHotkeyFunctions.user.js)
- enables some hotkey functions. im so lazy to use mouse for this functions
- [TAB] : move cursor focus to answer box and chat box
- [ESC] : remove zombie tooltips
- [PgUp] : increase volume
- [PgDn] : decrease volume
- [Ctrl + M] : toggle mute
- [Shift + Enter] : skip
- [Shift + Alt + S] : toggle autoskip
- [Shift + PgUp] : move box focus to upper box
- [Shift + PgDn] : move box focus to lower box
- [Shift + Home] : move box focus to box 1
- [Shift + End] : move box focus to my box
- [Ctrl + Left] : join game in lobby. toggle ready if you joined
- [Ctrl + Right] : change to spec in lobby if you joined
- [Ctrl + Up] : start game if you are host and all players are ready
- [Ctrl + Down] : start vote for returning lobby if game started and you are host

### ~~amqLadderAssist.user.js~~
- not supported :runner:
- ~~This script is written to make IHI ladder game more comfortable.~~
- ~~You can open and close ladder info window by pressing [ALT+L].~~
- ~~Cloud button is for updating data manually. You can update by clicking it. It will receive match data from spreadsheet. Updating data takes a few seconds. just wait. It recieves data automatically when ladder window is opened first time only.~~
- ~~It shows your matches to play when match data is received.~~
- ~~Opponents of green rows are online, opponents of red rows are offline.~~
- ~~Tier is lower one of two.~~
- ~~R column button is for making room and changing settings. If you clicked it when you are outside of room, it makes room with match type and tier settings. If you clicked it when you are in a room and you are host, it changes settings.~~
- ~~I column button is for inviting opponent. You can invite opponent by clicking it. it works when you are in a room and opponent is online.~~
- ~~P column button is for copying opponent's discord id to clipboard. It is useful for pinging opponent.~~
- ~~W/L/D column buttons are for copying Win/Lose/Draw report command to clipboard. It is just for copying text. It doesn't report automatically.~~
- ~~Phone button on the left side of cloud button is for copying all opponent's discord id to clipboard. It is useful for pinging all opponents.~~

### [amqMousewheelVolumeControl.user.js](https://github.com/nyamu-amq/amq_scripts/raw/master/amqMousewheelVolumeControl.user.js)
- you can adjust volume with mouse wheel when mouse cursor is over video area or avatar area

### [amqOneGroupGlow.user.js](https://github.com/nyamu-amq/amq_scripts/raw/master/amqOneGroupGlow.user.js)
- correct answer players glowing works even stadings box is only one box.

### [catboxVolume.user.js](https://github.com/nyamu-amq/amq_scripts/raw/master/catboxVolume.user.js)
- you can adjust volume with mouse wheel when you opened some media on catbox

### ~~amqNoFriendRoomFilter.user.js~~
- friend room filter is official now. remove this script on your browser if you added it
- literally [OBSOLETE](https://files.catbox.moe/hwb7zh.webm)

---
im not good at javascript/html/css yet. so this scripts might have some bugs

codes of Joseph and Klem and zol helped me to study javascript. thank you very much coding gods :place_of_worship:
