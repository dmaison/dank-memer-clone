import { config } from 'dotenv';
import fetch from 'node-fetch';

config();

const API = `https://discord.com/api/v10/applications/${process.env.APPLICATION_ID}/commands`,
headers = {
    'Authorization': `Bot ${process.env.BOT_TOKEN}`,
    'Content-Type': 'application/json',
},
commands = [
    {
        name: 'rate',
        description: 'Rate users!',
        options: [
            {
                type: 3,
                name: 'type',
                description: 'Rate type',
                required: true,
                choices: [{
                    name: 'peepee',
                    value: 'peepee'
                },
                {
                    name: 'dank',
                    value: 'dank'
                },
                {
                    name: 'epicgamer',
                    value: 'epicgamer'
                },
                {
                    name: 'gay',
                    value: 'gay'
                },
                {
                    name: 'simp',
                    value: 'simp'
                },
                {
                    name: 'stank',
                    value: 'stank'
                },
                {
                    name: 'bad',
                    value: 'bad'
                },
                {
                    name: 'waifu',
                    value: 'waifu'
                },
                {
                    name: 'mongoloid',
                    value: 'mongoloid'
                }],
            },
            {
                type: 6,
                name: 'user',
                description: 'User to rate',
                required: true
            }
        ]
      }
]


// submit actions
const res = await fetch( API, {
    body: JSON.stringify(commands),
    headers,
    method: 'PUT'
}),
test = await res.json();

console.log( API, test );