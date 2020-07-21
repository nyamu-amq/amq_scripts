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
- This script is written to make IHI ladder game more comfortable.
- You can open and close ladder info window by pressing [ALT+L].
- Cloud button is for updating data manually. You can update by clicking it. It will receive match data from spreadsheet. Updating data takes a few seconds. just wait. It recieves data automatically when ladder window is opened first time only.
- It shows your matches to play when match data is received.
- Opponents of green rows are online, opponents of red rows are offline.
- Tier is lower one of two.
- R column button is for making room and changing settings. If you clicked it when you are outside of room, it makes room with match type and tier settings. If you clicked it when you are in a room and you are host, it changes settings.
- I column button is for inviting opponent. You can invite opponent by clicking it. it works when you are in a room and opponent is online.
- P column button is for copying opponent's discord id to clipboard. It is useful for pinging opponent.
- W/L/D column buttons are for copying Win/Lose/Draw report command to clipboard. It is just for copying text. It doesn't report automatically.
- Phone button on the left side of cloud button is for copying all opponent's discord id to clipboard. It is useful for pinging all opponents.

### amqMousewheelVolumeControl.user.js
- adjust volume with mouse wheel when mouse cursor is over video area or avatar area
- it works in expand library also

### amqNoFriendRoomFilter.user.js
- add no friend room filter
- ~~this script might crash page design if you are using Elodie's custom style....~~
  + i think it has been fixed since version 0.2


im not good at javascript/html/css yet. so this scripts might have some bugs

codes of Joseph and Klem helped me to study javascript. thank you very much
