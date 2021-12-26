/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * November 30, 2020 by Jay Liu
 */

// eslint-disable-next-line no-unused-vars
import { types } from '@onepacs/core';
import { MODIFIER_KEYS, DISALLOWED_COMBINATIONS } from './hotkeysConfig';

/**
 * @typedef {Object} HotkeyValidatorParam
 * @prop {string} [commandName] command name string to be updated
 * @prop {string[]} pressedKeys new array of keys to be added for the commandName
 * @prop {types.HotkeyDictionary} [hotkeys] all hotkeys currently into the app
 *
 * @typedef {Object} HotkeyValidatorResult
 * @prop {boolean} hasError
 * @prop {string} [errorMessage]
 *
 * @typedef {function (HotkeyValidatorParam): HotkeyValidatorResult | undefined} HotkeyValidator
 */

/**
 * @param {string[]} pressedKeysArray
 * @returns {string}
 */
const formatPressedKeys = pressedKeysArray => pressedKeysArray.join('+');

const ERROR_MESSAGES = {
    MODIFIER:
    'It\'s not possible to define only modifier keys (ctrl, alt and shift) as a shortcut',
    EMPTY: 'Field can\'t be empty.',
};


/** @type {HotkeyValidator[]} */
const hotkeysValidators = [
    emptyValidator,
    modifierValidator,
    conflictingValidator,
    disallowedValidator,
];

/**
 * Take the updated command and keys and validate the changes with all validators
 *
 * @param {HotkeyValidatorParam} params
 * @returns {HotkeyValidatorResult | undefined} errorMessage coming from any of the validator or undefined if none
 */
export function validateCommandKey({ commandName, pressedKeys, hotkeys }) {
    for (const validator of hotkeysValidators) {
        const validation = validator({
            commandName,
            pressedKeys,
            hotkeys,
        });
        if (validation && validation.hasError) {
            return validation;
        }
    }

    return {
        hasError: false,
        errorMessage: undefined,
    };
};


/**
 * @param {types.HotkeyDictionary} hotkeys
 * @param {string} currentCommandName
 * @param {string[]} pressedKeys
 */
function findConflictingCommand(hotkeys, currentCommandName, pressedKeys) {
    let firstConflictingCommand = undefined;
    const formatedPressedHotkeys = formatPressedKeys(pressedKeys);

    for (const commandName in hotkeys) {
        const toolHotkeys = hotkeys[commandName].keys;
        const formatedToolHotkeys = formatPressedKeys(toolHotkeys);

        if (formatedPressedHotkeys === formatedToolHotkeys &&
            commandName !== currentCommandName
        ) {
            firstConflictingCommand = hotkeys[commandName];
            break;
        }
    }

    return firstConflictingCommand;
}

// VALIDATORS

/** @type {HotkeyValidator} */
function modifierValidator({ pressedKeys }) {
    const lastPressedKey = pressedKeys[pressedKeys.length - 1];
    // Check if it has a valid modifier
    const isModifier = MODIFIER_KEYS.includes(lastPressedKey);
    if (isModifier) {
        return {
            hasError: true,
            errorMessage: ERROR_MESSAGES.MODIFIER,
        };
    }
}

/** @type {HotkeyValidator} */
function emptyValidator({ pressedKeys = [] }) {
    if (!pressedKeys.length) {
        return {
            hasError: true,
            errorMessage: ERROR_MESSAGES.EMPTY,
        };
    }
}

/** @type {HotkeyValidator} */
function conflictingValidator({ commandName, pressedKeys, hotkeys }) {
    const conflictingCommand = findConflictingCommand(
        hotkeys,
        commandName,
        pressedKeys
    );

    if (conflictingCommand) {
        return {
            hasError: true,
            errorMessage: `"${conflictingCommand.label}" is already using the "${pressedKeys}" shortcut.`,
        };
    }
}

/** @type {HotkeyValidator} */
function disallowedValidator({ pressedKeys = [] }) {
    const lastPressedKey = pressedKeys[pressedKeys.length - 1];
    const modifierCommand = formatPressedKeys(
        pressedKeys.slice(0, pressedKeys.length - 1)
    );

    const disallowedCombination = DISALLOWED_COMBINATIONS[modifierCommand];
    const hasDisallowedCombinations = disallowedCombination
        ? disallowedCombination.includes(lastPressedKey)
        : false;

    if (hasDisallowedCombinations) {
        return {
            hasError: true,
            errorMessage: `"${formatPressedKeys(
                pressedKeys
            )}" shortcut combination is not allowed`,
        };
    }
}
