const actorD = game.actors.get(args[0].actor._id);
const tokenD = canvas.tokens.get(args[0].tokenId);
const level = args[0].spellLevel;
const summonType = "Bigby's Hand";
const summonerDc = actorD.data.data.attributes.spelldc;
const summonerAttack = summonerDc - 8;
const summonerMod = getProperty(
  tokenD.actor,
  `data.data.abilities.${getProperty(
    tokenD.actor,
    "data.data.attributes.spellcasting"
  )}.mod`
);

let fistScale = "";
let graspScale = "";

if (level - 5 > 0) {
  fistScale = ` + ${(level - 5) * 2}d8[force]`;
}
if (level - 5 > 0) {
  graspScale = ` + ${(level - 5) * 2}d6[bludgeoning]`;
}

console.log("fistScale: ", fistScale);
console.log("graspScale: ", graspScale);
let choice = await new Promise((resolve) => {
  new Dialog({
    title: "Choose your color:",
    buttons: {
      one: {
        label:
          '<img src="modules/jb2a_patreon/Library/5th_Level/Arcane_Hand/ArcaneHand_Human_01_Idle_Blue_Thumb.webp" width="40" height="40" style="border:0px"><br>Blue',
        callback: () => {
          resolve({
            token: {
              img: "modules/jb2a_patreon/Library/5th_Level/Arcane_Hand/ArcaneHand_Human_01_Idle_Blue_400x400.webm",
            },
          });
        },
      },
      two: {
        label:
          '<img src="modules/jb2a_patreon/Library/5th_Level/Arcane_Hand/ArcaneHand_Human_01_Idle_Green_Thumb.webp" width="40" height="40" style="border:0px"><br>Green',
        callback: () => {
          resolve({
            token: {
              img: "modules/jb2a_patreon/Library/5th_Level/Arcane_Hand/ArcaneHand_Human_01_Idle_Green_400x400.webm",
            },
          });
        },
      },
      three: {
        label:
          '<img src="modules/jb2a_patreon/Library/5th_Level/Arcane_Hand/ArcaneHand_Human_01_Idle_Purple_Thumb.webp" width="40" height="40" style="border:0px"><br>Purple',
        callback: () => {
          resolve({
            token: {
              img: "modules/jb2a_patreon/Library/5th_Level/Arcane_Hand/ArcaneHand_Human_01_Idle_Purple_400x400.webm",
            },
          });
        },
      },
      fourth: {
        label:
          '<img src="modules/jb2a_patreon/Library/5th_Level/Arcane_Hand/ArcaneHand_Human_01_Idle_Red_Thumb.webp" width="40" height="40" style="border:0px"><br>Red',
        callback: () => {
          resolve({
            token: {
              img: "modules/jb2a_patreon/Library/5th_Level/Arcane_Hand/ArcaneHand_Human_01_Idle_Red_400x400.webm",
            },
          });
        },
      },
    },
  }).render(true);
});

let updates = {
  token: {
    alpha: 0,
    name: `${summonType} of ${actorD.name}`,
  },
  actor: {
    name: `${summonType} of ${actorD.name}`,
    "data.attributes.hp": {
      value: actorD.data.data.attributes.hp.max,
      max: actorD.data.data.attributes.hp.max,
    },
  },
  embedded: {
    Item: {
      "Clenched Fist": {
        "data.attackBonus": `- @mod - @prof + ${summonerAttack}`,
        "data.damage.parts": [[`4d8[force] ${fistScale}`, "force"]],
      },
      "Grasping Hand": {
        itemacro: {
          macro: {
            data: {
              _id: null,
              name: "Grasping Hand",
              type: "script",
              author: "jM4h8qpyxwTpfNli",
              img: "icons/svg/dice-target.svg",
              scope: "global",
              command:
                'console.log(args);\nasync function wait(ms) { return new Promise(resolve => { setTimeout(resolve, ms); }); }\n\nfunction filter(array, value, key) {\n  return array.filter(\n    key\n      ? (a) => a[key] === value\n      : (a) => Object.keys(a).some((k) => a[k] === value)\n  );\n}\nconst lastArg = args[args.length - 1];\nconsole.log(lastArg);\nconst actorD = game.actors.get(args[0].actor._id);\nconsole.log("actorD: ", actorD);\nconst tokenD = canvas.tokens.get(args[0].tokenId);\nconsole.log("tokenD: ", tokenD);\n// let target = await fromUuid(args[0].hitTargetUuids[0] ?? "");\nlet target = lastArg.targets;\nconst ttarget = canvas.tokens.get(lastArg.targets[0].id);\nconsole.log("target: ", target);\nconsole.log("ttarget: ", ttarget);\nlet uuid = target[0].uuid;\nlet targetSize = target[0]._actor.data.data.traits.size;\nconsole.log("targetSize: ", targetSize);\n\nlet targetCondition = target[0].data.actorData.effects;\n\nlet grappled = filter(targetCondition, "Grappled");\n\nconsole.log("grappled: ", grappled);\nlet actionName = "Grapple";\nlet itemDescription = "<p>When you want to grab a creature or wrestle with it, you can use the Attack action to make a Special melee Attack, a grapple. If you’re able to make multiple attacks with the Attack action, this Attack replaces one of them.</p><p>The target of your grapple must be no more than one size larger than you and must be within your reach. Using at least one free hand, you try to seize the target by making a grapple check instead of an Attack roll: a Strength (Athletics) check contested by the target’s Strength (Athletics) or Dexterity (Acrobatics) check (the target chooses the ability to use). If you succeed, you subject the target to the Grappled condition (see Conditions ). The condition specifies the things that end it, and you can release the target whenever you like (no action required).</p>";\nif (targetSize === "grg") {\n  ui.notifications.warn("Target too big to grapple!");\n  return;\n}\ndebugger;\nif (grappled[0]?.label === "Grappled") {\n  ui.notifications.info("Crushing " + `${target[0].data.name}`);\n  let damageRoll = await new Roll("2d6[bludgeoning]+").evaluate();\n  console.log(damageRoll.total);\n    new MidiQOL.DamageOnlyWorkflow(actorD, ttarget, damageRoll.total, "bludgeoning", [ttarget], damageRoll, { flavor: `${target[0].data.name} is crushed`, itemData: item?.toObject(), itemCardId: "new", useOther: true })\n} else {\n  let bigbySkill = "ath";\n  let targetSkill =\n    target[0].data.document._actor.data.data.skills.ath.total >\n    target[0].data.document._actor.data.data.skills.acr.total\n      ? "ath"\n      : "acr";\n  let bigbyCheck =\n    actorD.data.type === "npc"\n      ? { fastForward: false, chatMessage: false }\n      : { fastForward: true, chatMessage: false };\n  let targetCheck =\n    target[0].data.type === "character"\n      ? { fastForward: false, chatMessage: false }\n      : { fastForward: true, chatMessage: false };\n  let bigbyRoll = await MidiQOL.socket().executeAsGM("rollAbility", {\n    request: "skill",\n    targetUuid: target[0].actor.uuid,\n    ability: bigbySkill,\n    options: bigbyCheck,\n  });\n  let targetRoll = await MidiQOL.socket().executeAsGM("rollAbility", {\n    request: "skill",\n    targetUuid: target[0].actor.uuid,\n    ability: targetSkill,\n    options: targetCheck,\n  });\n  midiExec(actionName, itemDescription, bigbyRoll, targetRoll);\n}\n\nasync function midiExec(actionName, itemDescription, bigbyRoll, targetRoll) {\n  let bigbyRollType = bigbyRoll.terms[0].options.advantage\n    ? " (Advantage)"\n    : bigbyRoll.terms[0].options.disadvantage\n    ? " (Disadvantage)"\n    : "";\n  let targetRollType = targetRoll.terms[0].options.advantage\n    ? " (Advantage)"\n    : targetRoll.terms[0].options.disadvantage\n    ? " (Disadvantage)"\n    : "";\n  game.dice3d?.showForRoll(bigbyRoll);\n  game.dice3d?.showForRoll(targetRoll);\n  let playerWin = "";\n  let targetWin = "";\n  bigbyRoll.total >= targetRoll.total\n    ? (playerWin = `success`)\n    : (targetWin = `success`);\n  console.log("playerWin: ", playerWin);\n  if (playerWin === "success") {\n    game.dfreds.effectInterface.addEffect({ effectName: \'Grappled\', uuid });\n  } \n  let damage_results = `\n      <div><h2>${actionName}</h2>${itemDescription}</div>\n    <div class="flexrow 2">\n    <div><div style="text-align:center">${actorD.name}</div></div><div><div style="text-align:center">${target[0].name}</div></div>\n    </div>\n    <div class="flexrow 2">\n      <div>\n        <div style="text-align:center">Acrobatics${bigbyRollType}</div>\n        <div class="dice-roll">\n          <div class="dice-result">\n            <div class="dice-formula">${bigbyRoll.formula}</div>\n            <div class="dice-tooltip">\n              <div class="dice">\n                <header class="part-header flexrow">\n                  <span class="part-formula">${bigbyRoll.formula}</span>\n                  <span class="part-total">${bigbyRoll.total}</span>\n                </header>\n              </div>\n            </div>\n            <h4 class="dice-total ${playerWin}">${bigbyRoll.total}</h4>\n          </div>\n        </div>\n      </div>\n      <div>\n        <div style="text-align:center">Acrobatics${targetRollType}</div>\n        <div class="dice-roll">\n          <div class="dice-result">\n            <div class="dice-formula">${targetRoll.formula}</div>\n            <div class="dice-tooltip">\n              <div class="dice">\n                <header class="part-header flexrow">\n                  <span class="part-formula">${targetRoll.formula}</span>\n                  <span class="part-total">${targetRoll.total}</span>\n                </header>\n              </div>\n            </div>\n            <h4 class="dice-total ${targetWin}">${targetRoll.total}</h4>\n          </div>\n        </div>\n      </div>\n\n    </div>`;\n  const chatMessage = game.messages.get(lastArg.itemCardId);\n  let content = duplicate(chatMessage.data.content);\n  const searchString =\n    /<div class="midi-qol-saves-display">[\\s\\S]*<div class="end-midi-qol-saves-display">/g;\n  const replaceString = `<div class="midi-qol-saves-display"><div class="end-midi-qol-saves-display">${damage_results}`;\n  content = content.replace(searchString, replaceString);\n  chatMessage.update({ content: content });\n  await wait(500);\n  await ui.chat.scrollBottom();\n}',
              folder: null,
              sort: 0,
              permission: {
                default: 0,
              },
              flags: {},
            },
          },
        },
      },
    },
  },
};

function greetings(templateData, summonedToken) {
  ChatMessage.create({ content: `Bigby's hand appears.` });

  let colorChoice = summonedToken.data.img;

  if (colorChoice.includes("Blue")) {
    return ChatMessage.create({
      speaker: { alias: "Bigby's Hand" },
      content: `<img src="modules/jb2a_patreon/Library/5th_Level/Arcane_Hand/ArcaneHand_Human_01_Idle_Blue_Thumb.webp" width="30" height="30" style="border:0px"> <i>Gives ${actorD.name} a thumbs up.</i> 👍`,
    });
  } else if (colorChoice.includes("Green")) {
    return ChatMessage.create({
      speaker: { alias: "Bigby's Hand" },
      content: `<img src="modules/jb2a_patreon/Library/5th_Level/Arcane_Hand/ArcaneHand_Human_01_Idle_Green_Thumb.webp" width="30" height="30" style="border:0px"> <i>Throws a peace sign at ${actorD.name}.</i> ✌️`,
    });
  } else if (colorChoice.includes("Purple")) {
    return ChatMessage.create({
      speaker: { alias: "Bigby's Hand" },
      content: `<img src="modules/jb2a_patreon/Library/5th_Level/Arcane_Hand/ArcaneHand_Human_01_Idle_Purple_Thumb.webp" width="30" height="30" style="border:0px"> <i>Waves at ${actorD.name}.</i> 👋`,
    });
  } else if (colorChoice.includes("Red")) {
    return ChatMessage.create({
      speaker: { alias: "Bigby's Hand" },
      content: `<img src="modules/jb2a_patreon/Library/5th_Level/Arcane_Hand/ArcaneHand_Human_01_Idle_Red_Thumb.webp" width="30" height="30" style="border:0px"> <i>Waits for ${actorD.name} to give a high five.</i> 🖐️️`,
    });
  }
}

async function myEffectFunction(template, update) {
  //prep summoning area
  let effect = "";

  let colorChoice = update.token.img;

  if (colorChoice.includes("Blue")) {
    effect =
      "modules/jb2a_patreon/Library/Generic/Explosion/Explosion_01_Blue_400x400.webm";
  } else if (colorChoice.includes("Green")) {
    effect =
      "modules/jb2a_patreon/Library/Generic/Explosion/Explosion_01_Green_400x400.webm";
  } else if (colorChoice.includes("Purple")) {
    effect =
      "modules/jb2a_patreon/Library/Generic/Explosion/Explosion_01_Purple_400x400.webm";
  } else if (colorChoice.includes("Red")) {
    effect =
      "modules/jb2a_patreon/Library/Generic/Explosion/Explosion_04_Dark_Red_400x400.webm";
  }

  new Sequence()
    .sound()
    .file(
      "s3/audio/soundboard/Fire%20and%20Explosions/large%20blast/Explosion%20Blast%20Large%2001.ogg"
    )
    .effect()
    .file(effect)
    .atLocation(template)
    .center()
    .scale(1.5)
    .belowTokens()
    .play();
}

async function postEffects(template, token) {
  //bring in our minion
  new Sequence().animation().on(token).fadeIn(500).play();
}

const callbacks = {
  pre: async (template, update) => {
    myEffectFunction(template, update);
    await warpgate.wait(500);
  },
  post: async (template, token) => {
    postEffects(template, token);
    await warpgate.wait(500);
    greetings(template, token);
  },
};

const options = { controllingActor: actor };

updates = mergeObject(updates, choice);
console.log("updates: ", updates);
warpgate.spawn(summonType, updates, callbacks, options);
