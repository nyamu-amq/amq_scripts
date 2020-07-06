# amq_scripts

im so lazy to write usage.... and english is too hard for me..../o\

### amqAutoReady.user.js
- It changes your state to ready automatically when you are in lobby.
- Even when settings are changed.
- You can unready by clicking unready button manually.
- You can toggle it with [Alt+R]. Default is off.
- Dedicated to lazists.

### amqBugfix.user.js
- it fixes bug that wrong game type on game settings

### amqEmojiAnswer.js
- convert emoji shortcode in answer box when press enter
- it works on room name also now

### amqFriendOnlineNotifier.user.js
- show notification when your friend is online

### amqHighlightFriends.user.js
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

### amqHotkeyFunctions.user.js
- enables some hotkey functions. im so lazy to use mouse for this functions
- [TAB] : move cursor focus to answer box and chat box
- [ESC] : remove zombie tooltips
- [PgUp] : increase volume
- [PgDn] : decrease volume
- [Ctrl + M] : toggle mute
- [Shift + Enter] : skip
- [Shift + PgUp] : move box focus to upper box
- [Shift + PgDn] : move box focus to lower box
- [Shift + Home] : move box focus to box 1
- [Shift + End] : move box focus to my box
- [Ctrl + Left] : join game in lobby. toggle ready if you joined
- [Ctrl + Right] : change to spec in lobby if you joined
- [Ctrl + Up] : start game if you are host and all players are ready
- [Ctrl + Down] : start vote for returning lobby if game started and you are host

### amqLadderAssist.user.js
- you can open and close ladder info window by pressing [ALT+L]
- it receives match data from spreadsheet when it is opened. it takes few seconds. just wait
- it shows your matches to play when match data is received
- green row is opponent is online, red row is opponent is offline
- tier is lower one of two
- if you clicked 'host room or change settings' button....
  + when you are in roomlist, it makes room with match type and tier settings
  + when you are in a room, it changes settings
- you can invite opponent by clicking invite button. it worked when you are in a room and opponent is online
- it receives match data only when it is opened. if you want to receive latest match data, close and open it again

### amqMousewheelVolumeControl.user.js
- adjust volume with mouse wheel when mouse cursor is over video area or avatar area
- it works in expand library also

### amqNoFriendRoomFilter.user.js
- add no friend room filter
- ~~this script might crash page design if you are using Elodie's custom style....~~
  + i think it has been fixed since version 0.2


im not good at javascript/html/css yet. so this scripts might have some bugs

codes of Joseph and Klem helped me to study javascript. thank you very much
