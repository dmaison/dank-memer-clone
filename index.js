import 'dotenv/config';
import {
    InteractionType,
    InteractionResponseType,
} from 'discord-interactions';
import { vagina, penis } from './genitals.js';
import nacl from 'tweetnacl';

export const handler = async ( event ) => {
	
	const { headers } = event || {},
	signature = headers['x-signature-ed25519'],
    timestamp = headers['x-signature-timestamp'],
	strBody = event.body,
	valid = nacl.sign.detached.verify(
		Buffer.from( timestamp + strBody ),
		Buffer.from( signature, 'hex' ),
		Buffer.from( process.env.PUBLIC_KEY, 'hex' )
	);

	// validate key
	if( !valid ){
		return {
			statusCode: 401,
			body: JSON.stringify( 'invalid request signature' )
		}
	}

	const { type, id, data, member } = JSON.parse( event.body ),
	{ name: commandName, options, resolved } = data || {},
	{ user } = member || {},
	{ id: userId } = user || {};

    // respond to verification requests
    if( type === InteractionType.PING ){
        return { 
			statusCode: 200,
			body: JSON.stringify({
				type: InteractionResponseType.PONG
			})
		};
    }


	if (type === InteractionType.APPLICATION_COMMAND) {
		//test
		if( commandName === 'foo' ){
			return JSON.stringify({  
				type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,  
				data: { content: 'bar' }
			})
		}

		if( commandName === 'rate' ){
			return JSON.stringify({  
				type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,  
				data: { 
					embeds: handleRate( options[0].value, resolved.users[ options[1].value ].global_name ),
				}
			})
		}
	}

	return {
		statusCode: 404
	}
};

function convertToPenis( percent ){
	const count = Math.floor( percent/5 ),
	vag = ( Math.floor( Math.random() * 100 ) === 1 ),
	honkingDong = ( Math.floor( Math.random() * 100 ) === 1 ),
	includeCum = ( Math.floor( Math.random() * 100 ) === 1 );

	if( vag ) return vagina;
	if( honkingDong ) return penis;

	let str = '8';

	for( let i = 0; i < count + 1; ++i ) str += '=';

	str += `D${ includeCum ? '~~' : '' }`;

	if( percent === 100 ){
		str += '\n\n ```diff\n-!!MAXIMUM PEEPEE!!-\n```';
	}

	return str;
}

function convertToTenth( value ){
	return `${ Math.floor( value / 10 ) }/10`;
}

function handleRate( type, target ){

	let description,
	value = Math.floor( Math.random() * 100 ),
	color = 2829617;

	if( [ 'null', null ].includes( target ) ) target = "Dank Memer";

	switch( type ){
		case 'peepee':
			description = `${target}'s penis:\n${ convertToPenis( value ) }`;
			break;
		case 'waifu':
			description = `${target} is ${ convertToTenth( value ) } ${ type }`;
			break;
		default:
			description = `${target} is ${ value }% ${ type }`;
			break;
	}

	// fancy colors
	/*
	if( value < 25 ){
		color = 11674146;
	} else if( value > 75 ){
		color = 8190976;
	}*/

	return ([{
		title: `${ type } r8 machine`,
		description,
		color
	}]);

}