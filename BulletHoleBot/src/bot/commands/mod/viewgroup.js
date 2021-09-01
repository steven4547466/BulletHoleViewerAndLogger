const Command = require("../../structures/command");
const ErisComponents = require("eris-components");
const http = require("http");
const crypto = require("crypto");
const Canvas = require("canvas")

const fix = 250;


class SetReaction extends Command {
  constructor(client) {
    super(client, {
      name: "viewgroup",
      description: "Views the bullet hole groups of a user on a specific server and round extracted on to a 2d set of images.",
      usage: "viewgroup",
      aliases: ["vg"],
      guildOnly: true
    });
    this.client = client;
  }

  async run(message, args, client) { // eslint-disable-line no-unused-vars
    if (!message.member.roles.some(r => client.config.modRoles.includes(r))) return message.channel.createMessage("You do not have the necessary permissions to run this command.");

    http.get(client.config.requestAddress, (res) => {
      if (res.statusCode != 200) return message.channel.createMessage(`Non 200 code while requesting: ${res.statusCode}`);
      res.setEncoding("utf8");
      let rawData = "";
      res.on("data", (chunk) => { rawData += chunk; });
      res.on("end", () => {
        try {
          const parsedData = JSON.parse(rawData);
          let time = Date.now()

          let options = []
          for (let serverNum of Object.keys(parsedData).filter((a, b) => a - b)) {
            options.push(new ErisComponents.MenuOption()
              .setLabel(`Server ${serverNum}`)
              .setValue(`${serverNum}`)
              .setDescription(`Select server ${serverNum}`))
          }

          let serverMenu = new ErisComponents.Menu()
            .setPlaceholder(`Server selector`)
            .setID(`${time}-server-selector`)
            .setMaxValues(1)
            .setMinValues(1)
            .setDisabled(false)
            .addOptions(options)

          this.createComponents(client, message.channel.id, serverMenu, { text: "Server Selector" }, (body) => body.data.custom_id == `${time}-server-selector`, (collector, resBody, msg) => {
            const serverNum = resBody.data.values[0]
            collector.stop()
            client.erisClient.deleteMessage(msg.channel_id, msg.id)
            let options = []
            for (let roundTime of Object.keys(parsedData[serverNum]).filter((a, b) => a - b)) {
              options.push(new ErisComponents.MenuOption()
                .setLabel(`Round Timestamp ${new Date(parseInt(roundTime))}`)
                .setValue(`${roundTime}`)
                .setDescription(`Select round ${roundTime}`))
            }

            let menu = new ErisComponents.Menu()
              .setPlaceholder(`Round selector`)
              .setID(`${time}-round-selector`)
              .setMaxValues(1)
              .setMinValues(1)
              .setDisabled(false)
              .addOptions(options)
            this.createComponents(client, resBody.message.channel_id, menu, { text: "Round Selector" }, (body) => body.data.custom_id == `${time}-round-selector`, (collector, resBody, msg) => {
              const roundTimestamp = resBody.data.values[0];
              const userGroups = {}
              collector.stop()
              client.erisClient.deleteMessage(msg.channel_id, msg.id)

              let options = []
              for (let userId of Object.keys(parsedData[serverNum][roundTimestamp])) {
                let holes = []
                for (let bullet of parsedData[serverNum][roundTimestamp][userId].bullets) {
                  holes.push(new BulletHole(userId, new Point3D(parseFloat(bullet.x * fix), parseFloat(-bullet.y * fix), parseFloat(bullet.z * fix)), "#000000"))
                }

                let groups = this.defineGroups(userId, holes, 0.01)

                if (groups.length == 0) continue

                userGroups[userId] = groups

                let totalGroups = 0
                for (let [axis, g] of Object.entries(userGroups[userId])) {
                  totalGroups += g.length
                }
                userGroups[userId].totalGroups = totalGroups

                options.push(new ErisComponents.MenuOption()
                  .setLabel(`Select user ${parsedData[serverNum][roundTimestamp][userId].name}`)
                  .setValue(`${userId}`)
                  .setDescription(`Select user ${parsedData[serverNum][roundTimestamp][userId].name} (${userId})`))
              }

              if (options.length == 0) return client.erisClient.createMessage(resBody.message.channel_id, "No bullet groups found.")

              let menu = new ErisComponents.Menu()
                .setPlaceholder(`User selector`)
                .setID(`${time}-user-selector`)
                .setMaxValues(1)
                .setMinValues(1)
                .setDisabled(false)
                .addOptions(options)

              this.createComponents(client, resBody.message.channel_id, menu, { text: "User Selector" }, (body) => body.data.custom_id == `${time}-user-selector`, (collector, resBody, msg) => {
                const userId = resBody.data.values[0];
                collector.stop()
                client.erisClient.deleteMessage(msg.channel_id, msg.id)
                this.sendBulletViewer(client, parsedData, serverNum, roundTimestamp, userId, resBody, userGroups, 0)
                // return message.channel.createMessage("", { file: canvas.toBuffer(), name: "bullets.png" });
              })
            })
          })
        } catch (e) {
          return message.channel.createMessage(`Error while parsing: ${e.message}`);
        }
      });
    }).on("error", (e) => {
      return message.channel.createMessage(`Error while requesting: ${e.message}`);
    })
    // return message.channel.createMessage("Pog.", { file: canvas.toBuffer(), name: "Test.png" });
  }

  async createComponents(client, channel, components, options, filter, action) {
    let msg = await client.sendComponents(channel, components, options.text, options.file);
    let collector = new ErisComponents.ComponentsCollector(client.erisClient, filter, channel, { time: options.time || 60000 }, null);
    collector.on('collect', (resBody) => action(collector, resBody, msg))
  }

  sendBulletViewer(client, parsedData, serverNum, roundTimestamp, userId, rBody, userGroups, groupIndex, view = "xy") {
    let time = Date.now()
    const canvas = Canvas.createCanvas(1920, 1080);
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#666666";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (!userGroups[userId][view]) view = Object.keys(userGroups[userId])[0]
    let midpoint = this.defineMidpoint(userGroups[userId][view][groupIndex])
    this.drawBullets(userGroups[userId][view][groupIndex], midpoint, canvas, ctx)
    let nextGroupButton = new ErisComponents.Button()
      .setStyle('blurple')
      .setLabel('>')
      .setDisabled(userGroups[userId][view].length - 1 == groupIndex)
      .setID(`${time}-next-button`)
    let previousGroupButton = new ErisComponents.Button()
      .setStyle('blurple')
      .setLabel('<')
      .setDisabled(groupIndex == 0)
      .setID(`${time}-previous-button`)
    let xyButton = new ErisComponents.Button()
      .setStyle('blurple')
      .setLabel('View xy')
      .setDisabled(view == "xy" || userGroups[userId]["xy"].length == 0)
      .setID(`${time}-xy-button`)
    let zyButton = new ErisComponents.Button()
      .setStyle('blurple')
      .setLabel('View zy')
      .setDisabled(view == "zy" || userGroups[userId]["zy"].length == 0)
      .setID(`${time}-zy-button`)
    let xzButton = new ErisComponents.Button()
      .setStyle('blurple')
      .setLabel('View xz')
      .setDisabled(view == "xz" || userGroups[userId]["xz"].length == 0)
      .setID(`${time}-xz-button`)
    let actionRow = new ErisComponents.ActionRow()
      .addComponents([previousGroupButton, nextGroupButton, xyButton, zyButton, xzButton])
    this.createComponents(client, rBody.message.channel_id, actionRow, { text: `Bullet viewer for ${parsedData[serverNum][roundTimestamp][userId].name} (${userId}). Plane view: ${view.toUpperCase()} Bullet group ${groupIndex + 1}/${userGroups[userId][view].length} (${userGroups[userId].totalGroups} total)`, file: { file: canvas.toBuffer(), name: "bullets.png" } },
      (body) => body.data.custom_id == `${time}-previous-button` || body.data.custom_id == `${time}-next-button`
        || body.data.custom_id == `${time}-xy-button` || body.data.custom_id == `${time}-zy-button` || body.data.custom_id == `${time}-xz-button`,
      (collector, resBody, msg) => {
        try {
          collector.stop()
          client.erisClient.deleteMessage(msg.channel_id, msg.id)
          if (resBody.data.custom_id == `${time}-next-button`) {
            this.sendBulletViewer(client, parsedData, serverNum, roundTimestamp, userId, resBody, userGroups, groupIndex + 1, view)
          } else if (resBody.data.custom_id == `${time}-previous-button`) {
            this.sendBulletViewer(client, parsedData, serverNum, roundTimestamp, userId, resBody, userGroups, groupIndex - 1, view)
          } else if (resBody.data.custom_id == `${time}-xy-button`) {
            this.sendBulletViewer(client, parsedData, serverNum, roundTimestamp, userId, resBody, userGroups, 0, "xy")
          } else if (resBody.data.custom_id == `${time}-zy-button`) {
            this.sendBulletViewer(client, parsedData, serverNum, roundTimestamp, userId, resBody, userGroups, 0, "zy")
          } else if (resBody.data.custom_id == `${time}-xz-button`) {
            this.sendBulletViewer(client, parsedData, serverNum, roundTimestamp, userId, resBody, userGroups, 0, "xz")
          }
        } catch (e) {
          console.error(e)
        }
      })
  }

  drawBullets(group, midpoint, canvas, ctx) {
    while (!group.group.every(b => (b.point[group.majorAxis] - midpoint[0] + canvas.width / 2) <= canvas.width && (b.point[group.minorAxis] - midpoint[1] + canvas.height / 2) <= canvas.height)) {
      for (let bullet of group.group) {
        bullet.point = new Point3D(bullet.point.x / 2, bullet.point.y / 2, bullet.point.z / 2)
      }
    }
    for (let bullet of group.group) {
      bullet.draw(canvas, ctx, group.majorAxis, group.minorAxis, midpoint[0], midpoint[1])
    }
  }

  defineMidpoint(group) {
    let x = group.group.reduce((a, c) => a + c.point[group.majorAxis], 0) / group.group.length
    let y = group.group.reduce((a, c) => a + c.point[group.minorAxis], 0) / group.group.length
    return [x, y]
  }

  getDist(point1, point2) {
    return Math.sqrt(Math.pow((point1.x - point2.x), 2) + Math.pow((point1.y - point2.y), 2) + Math.pow((point1.z - point2.z), 2))
  }

  branch(holes, from, staticAxis, maxDist) {
    let toReturn = [from]
    for (let bullet of holes) {
      if (bullet == from) continue
      if (Math.abs(from.point[staticAxis] - bullet.point[staticAxis]) <= maxDist * fix && toReturn.some(b => this.getDist(b.point, bullet.point) <= 2 * fix)) {
        toReturn.push(bullet)
      }
    }
    return toReturn;
  }

  defineGroups(userId, holes, maxDist) {
    let groups = { "xy": [], "zy": [], "xz": [] }
    let categorizedBullets = {}
    for (let axis of ["x", "y", "z"]) {
      let majorAxis = axis == "x" ? "z" : "x"
      let minorAxis = axis == "y" ? "z" : "y"
      for (let bullet of holes) {
        if (categorizedBullets[bullet.id] == axis) {
          continue
        }
        groups[`${majorAxis}${minorAxis}`].push({ group: this.branch(holes, bullet, axis, maxDist * fix || fix), majorAxis, minorAxis })
        for (let bullet of groups[`${majorAxis}${minorAxis}`][groups[`${majorAxis}${minorAxis}`].length - 1].group) {
          categorizedBullets[bullet.id] = axis
        }
      }
    }
    return { "xy": groups["xy"].filter(t => t.group.length > 5), "zy": groups["zy"].filter(t => t.group.length > 5), "xz": groups["xz"].filter(t => t.group.length > 5) }
  }
}

class BulletHole {
  constructor(userId, point, color) {
    this.userId = userId;
    this.id = crypto.randomBytes(16).toString("hex");
    this.point = point;
    this.color = color || "#000000";
    this.size = 8;
  }

  draw(canvas, ctx, majorAxis, minorAxis, offsetX, offsetY) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    let x = this.point[majorAxis] - offsetX + canvas.width / 2
    let y = this.point[minorAxis] - offsetY + canvas.height / 2
    ctx.arc(x, y, this.size, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
  }
}

class Point3D {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
}

module.exports = SetReaction;