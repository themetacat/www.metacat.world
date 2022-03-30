import React from 'react';

import PageHeader from '../../components/page-header';
// import Tab from '../../components/tab';

// import style from './index.module.css';

// const Area_sort = [
//   {
//     value: '< 100㎡',
//   },
//   {
//     value: '100㎡-200㎡',
//   },
//   {
//     value: '200㎡-500㎡',
//   },
//   {
//     value: '> 500㎡',
//   },
// ];
// const Height_sort = [
//   {
//     value: '< 10m',
//   },
//   {
//     value: '10 - 15m',
//   },
//   {
//     value: '15 - 20m',
//   },
//   {
//     value: '> 20m',
//   },
// ];
// const Price_week_sort = [
//   {
//     value: '< 0.1 ETH',
//   },
//   {
//     value: '0.1 ETH - 0.2 ETH',
//   },
//   {
//     value: '0.2 ETH - 0.5 ETH',
//   },
//   {
//     value: '> 0.5 ETH',
//   },
// ];
// const Built_sort = [
//   {
//     value: 'Built',
//   },
//   {
//     value: 'Not built',
//   },
// ];

// const Rank = [
//   {
//     value: 'Area',
//   },
//   {
//     value: 'Height',
//   },
//   {
//     value: 'Price',
//   },
// ];

export default function Rent() {
  return (
    <div className="bg-black relative">
      <PageHeader className="relative z-10" active={'rent'} />
    </div>
  );
}
