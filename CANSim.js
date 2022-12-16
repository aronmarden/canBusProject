var can = require('socketcan');

// Create a raw channel

var channel = can.createRawChannel("vcan0", true);

// Create a message object, and also set default values for speed and rpm, up is used to create a rev limiter effect. As shown in the video.

var msg = {
    'id': 500,
    data: [0, 0, 0, 0, 0, 0, 0, 0]
}
var speed = 0
var revs = 0
var up = true


// Create the interval function that changes the values every 100ms and then sends them out over can bus.

setInterval(() => {
    var out = {}
    var buff = Buffer.alloc(8)
    if (speed < 155) {
        speed = speed + 1
        revs = revs + 240
    }

    else {
        if (up) {
            revs = revs + 100
            up = false
        }
        else {
            revs = revs - 100
            up = true
        }
    }



    if (revs > 7000) {
        revs = 1000
    }

    buff.writeUIntBE(revs, 0, 4)
    buff.writeUIntBE(speed, 4, 2)
    console.log(buff)
    out.id = msg.id
    out.data = buff

    channel.send(out)

},

    100)

channel.start()