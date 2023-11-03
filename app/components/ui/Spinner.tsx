import {BiLoaderAlt} from 'react-icons/bi'

import { FC } from 'react';

interface SpinnerProps {
  
};

const Spinner: FC<SpinnerProps> = ({}) => {
  return (
    <div className='text-lg animate-spin'>
        <BiLoaderAlt />
    </div>
  );
};

export default Spinner;