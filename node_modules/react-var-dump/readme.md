# react-var-dump

[![npm version](https://badge.fury.io/js/react-var-dump.svg)](https://badge.fury.io/js/react-var-dump)

Simple data visualisation in `<pre />` html elements.

## installation
`npm i -S react-var-dump`

React must be installed.

## usage

```es6
import VarDump from 'react-var-dump';
import React from 'react';

const myData = { foo: 'bar' };

export default () => <VarDump data={myData} />;

```
## props

**data** : any object / value.

---
Licence: MIT
