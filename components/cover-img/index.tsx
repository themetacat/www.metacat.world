import React from 'react';

type Props = {
  img?: string;
  className?: string;
  error?: string;
};

export default function CoverImg({ img, className, error = '/images/logo.png' }: Props) {
  const [baseImg, setBaseImg] = React.useState(img);

  React.useEffect(() => {
    setBaseImg('/images/logo.png');
  }, [img]);
  return (
    <img
      className={className}
      src={baseImg}
      onLoad={() => {
        setBaseImg(img);
      }}
      onError={() => {
        setBaseImg(error);
      }}
    ></img>
  );
}
