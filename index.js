import 'dotenv/config';
import {
    InteractionType,
    InteractionResponseType,
} from 'discord-interactions';
import { vagina, penis, goaste } from './genitals.js';
import nacl from 'tweetnacl';

/**
 * Main handler
 * @param {object} event Lambda request event object
 * @returns {object} Lambda response event object
 */
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

	const { type, data } = JSON.parse( event.body ),
	{ name: commandName, options, resolved } = data || {};

    // respond to verification requests
    if( type === InteractionType.PING ){
        return { 
			statusCode: 200,
			body: JSON.stringify({
				type: InteractionResponseType.PONG
			})
		};
    }

	// respond to slash commands
	if (type === InteractionType.APPLICATION_COMMAND) {
		switch( commandName ){
			case 'rate':
				return JSON.stringify({  
					type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,  
					data: { 
						embeds: handleRate( options[0].value, resolved.users[ options[1].value ].global_name ),
					}
				});
			default:
				return {
					statusCode: 404
				}
		}
	}

	
};

/**
 * Converts a provided number to a basic ASCII penis.
 * 1:100 chance of getting a vagina, 1:100 chance of getting a detailed penis, 1:100 of getting tildes.
 * 
 * @param {number} percent Percentage to be converted
 * @returns {string} Converted representation of the percentage
 */
function convertToPenis( percent ){
	const count = Math.ceil( percent/5 ) - 1,
	modifier = Math.ceil( Math.random() * 200 ),
	vag = ( modifier === 1 ), // get random chance for a vagina
	megaNerd = ( modifier === 100 ), // get random chance for goatse
	honkingDong = ( modifier === 200 ), // get random chance for a honking dong
	includeCum = ( modifier > 50 && modifier < 100 ); // get random chance for cum

	if( vag ) return vagina;
	if( honkingDong ) return penis;
	if( megaNerd ) return goaste;

	let str = '8';

	for( let i = 1; i < count + 1; ++i ) str += '=';

	str += `D${ includeCum ? '~~' : '' }`;

	// alert user to the maximum get
	if( percent === 100 ) str += '\n\n ```diff\n- MAXIMUM PEEPEE -\n```';
	if( percent === 1 ) str += '\n\n ```diff\n- PEEPEE OF SHAME -\n```';

	return str;
}

/**
 * Converts a percentage to a fraction of tenths
 * 
 * @param {number} percent Percentage to be converted
 * @returns {string} Fractional representation of the percentage
 */
function convertToTenth( percent ){
	return `${ Math.ceil( percent / 10 ) }/10`;
}

/**
 * Handles the output for the `/rate` command
 * 
 * @param {string} type Type of rate for the prompt
 * @param {string} target User's public nickname
 * @returns {object} Discord embed object
 */
function handleRate( type, target ){

	let description,
	a = ( Math.random() * 100 ),
	b = ( Math.random() * 100 ),
	value = Math.ceil( ( a + b ) / 2  ), // get average of two random values
	color = 2829617;

	// if no nickname is provided, default to the bot's name
	if( [ 'null', null ].includes( target ) ) target = "fugbot";

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

	return ([{
		title: `${ type } r8 machine`,
		description,
		color
	}]);

}