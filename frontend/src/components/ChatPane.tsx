import React from 'react';
import { Pane } from './Pane';

export const ChatPane: React.FC = () => {
	return <Pane className='w-1/4 py-2'>
        <div className='border border-white rounded-lg h-full'></div>
    </Pane>;
};
