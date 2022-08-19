import React from 'react';

type Props = {
  img?: string;
  className?: string;
  error?: string;
};

export default function CoverImg({ img, className, error = '/images/logo.png' }: Props) {
  const [baseImg, setBaseImg] = React.useState(img);

  React.useEffect(() => {
    setBaseImg(img);
    console.log(img,baseImg);
    
  }, [img]);

  return (
    <img
      className={className}
      src={baseImg || '/images/logo.png'}
      onError={() => {
        setBaseImg(error);
      }}
    ></img>
  );
}
