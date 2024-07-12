import React from 'react';
import { observer } from 'mobx-react-lite';
import { Home } from './home/Home';

const Page = observer(() => {
  return (
    <>
      <style>
        {`
        * {
          margin: 0;
          padding: 0;
        }
      `}
      </style>
      <Home />
    </>
  );
});

export default Page;
