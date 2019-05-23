import React from 'react';

const var_dump = (props) => <pre>{JSON.stringify(props.data, null, 2)}</pre>;

export default var_dump;
