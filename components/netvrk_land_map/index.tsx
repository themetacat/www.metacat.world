import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { FeatureCollection } from 'geojson';

import {
  getNetVrkMap
} from '../../service';

const Map = () => {
  // const shapeTal = {
  //   shape: [
  //     {
  //       width: 30.0001125,
  //       height: 25.0001125,
  //     },
  //     { width: 25.0000362, height: 25.0000362 },
  //     {
  //       width: 25.0001125,
  //       height: 25.0001125,
  //     },
  //     { width: 24.9998989, height: 24.9998989 },
  //     { width: 25.0002613, height: 25.0002232 },
  //     { width: 25.0001736, height: 24.9996414 },
  //   ],
  // };
  // const geojson: FeatureCollection = {
  //   type: 'FeatureCollection',
  //   // 假设这个 FeatureCollection 对象包含一个 features 属性
  //   features: [
  //     {
  //       type: 'Feature',
  //       properties: { name: 'New York',  width: 30.0001125,height: 25.0001125,
  //      } ,
  //       geometry: {
  //         type: 'Point',
  //         coordinates: [-45.935242, 66.73061],
  //       },
  //     },
  //     {
  //       type: 'Feature',
  //       properties: { name: 'New York' ,width: 25.0000362, height: 25.0000362},
  //       geometry: {
  //         type: 'Point',
  //         coordinates: [-75.935242, 46.73061],
  //       },
  //     },
  //     {
  //       type: 'Feature',
  //       properties: { name: 'New York',width: 25.0001125,
  //       height: 25.0001125, },
  //       geometry: {
  //         type: 'Point',
  //         coordinates: [-78.93, 36.73],
  //       },
  //     },
  //     {
  //       type: 'Feature',
  //       properties: { name: 'New York',width: 25.0002613, height: 25.0002232 },
  //       geometry: {
  //         type: 'Point',
  //         coordinates: [-68.93, 46.73],
  //       },
  //     },
  //     {
  //       type: 'Feature',
  //       properties: { name: 'New York',width: 25.0001736, height: 24.9996414 },
  //       geometry: {
  //         type: 'Point',
  //         coordinates: [-63.935242, 46.73061],
  //       },
  //     },
  //     {
  //       type: 'Feature',
  //       properties: { name: 'New York',width: 25.0001736, height: 24.9996414  },
  //       geometry: {
  //         type: 'Point',
  //         coordinates: [-55.707104, -50.70710],
  //       },
  //     },
  //     // 其他 Feature 对象 ...
    
  //   ],
  // };
  const svgRef = useRef(null);
console.log(getNetVrkMap());


const requestPriceMapOneData = ()=>{
  const svg = d3.select(svgRef.current);
  const res = getNetVrkMap();
  res.then((resDA)=>{
console.log(resDA.data.parcels);


  d3.csv('https://nft.netvrk.co/data/data.csv').then((data) => {
    // // 创建地理投影
    const projection = d3.geoMercator();
    // .fitSize([width, height], geojson);
    // console.log( shapeTal.shape.map((item) => console.log(item));
    // const size = 25; // 正方形大小
    const area =  resDA.data.parcels.map((item)=>{
      // console.log(item)
      const { weight, height } = item.properties;
    
      return weight * height;
        })
// let coordinatesX;
// let coordinatesY;
const coordinatesNum = resDA.data.parcels.map((parcel) => {
// 使用数组解构获取 coordinates 数组中的第一个值和第二个值
const [coordinatesX, coordinatesY] = parcel.geometry.coordinates;
return[coordinatesX, coordinatesY]
});


// const coordinatesX = resDA.data.parcels.map((parcel) => {
//   return parcel[0];
// });
// const coordinatesY = resDA.data.parcels.map((parcel) => {
//   return parcel[1];
// });

// 输出所有 Feature 对象的 coordinates 数组
// const coordinates = resDA.data.geometry.coordinates.map((item)=>{
//   console.log(item);
//   // const { weight, height } = item.properties;

//   // return weight * height;
//     })

//       const areaArray = shapeTal.shape.map(({ width, height }) => width * height);
//       console.log(areaArray);
// console.log(projection,'projection')

// const area = geojson.features.map(feature => {
//   const { width, height } = feature.properties;
//   return width * height;

// });




console.log(area); // 输出所有 Feature 对象的面积
    const symbol = d3
      .symbol()
      .type(d3.symbolSquare)

      .size((d, i) => area[i]);
 

    // 创建地理路径生成器
    const path = d3.geoPath().projection(projection);
    console.log(symbol());
    // 绘制地图路径
    svg
      .selectAll('path')
      .data(resDA.data.parcels)
      .enter()
      .append('path')
      .attr('d', symbol)
      .attr('transform', (d, i) => `translate(${projection(coordinatesNum[i])})`)
      .attr('fill', 'red')
      .attr('stroke', 'black')
      .attr('stroke-width', 1);

    // 增加鼠标事件
    svg
      .selectAll('path')
      .on('pointerover', function (event, d) {
        // Show Tooltip
        d3.select(this).attr('fill', 'red');
        const tooltip = svg.append('g').attr('class', 'tooltip').style('pointer-events', 'none');
        tooltip
          .append('rect')
          .attr('width', 150) 
          .attr('height', 30)
          .attr('fill', 'white')
          .attr('stroke', 'gray')
          .attr('stroke-width', 1);
        tooltip.append('text').attr('x', 5).attr('y', 20).text(d.properties.name);
        const [x, y] = d3.pointer(event);
        console.log(x, y);
        //  const [x, y] = [event.pageX, event.pageY];
        tooltip.attr('transform', `translate(${x + 10},${y + 20})`);
      })
      .on('pointermove', function (event) {
        const [x, y] = d3.pointer(event);
        // const [x, y] = [event.pageX, event.pageY];
        console.log(x, y);
        svg.select('.tooltip').attr('transform', `translate(${x + 10},${y + 20})`);
      })
      .on('pointerout', function () {
        // Hide Tooltip
        d3.select(this).attr('fill', 'lightgray');
        svg.select('.tooltip').remove();
      });


    })  
      
    //   const projection = d3.geoMercator();
    //   const path = d3.geoPath().projection(projection);

    //   // 创建不同形状的生成器
    //   const square = d3.symbol().type(d3.symbolSquare);
    //   const circle = d3.symbol().type(d3.symbolCircle);

    //   // 提取数据中形状大小的最小和最大值
    //   const [minSize, maxSize] = d3.extent(data, (d) => +d.shape);

    //   // 为不同形状和大小创建不同路径
    //   const symbols = {
    //     square: (size) => square.size(size * size),
    //     circle: (size) => circle.size(size * size),
    //   };
    // console.log(data);

    //   // 绘制地图
    //   svg
    //     .selectAll('path')
    //     .data(geojson.features)
    //     .enter()
    //     .append('path')
    //     .attr('d', (d) => {
    //       const { shape } = data?.find((datum) => datum.name === d.properties.name);
    //        const symbol = symbols.square(shape); // 或者 symbols.circle(shape)
    //        return path(symbol());
    //     })
    //     .attr('transform', (d) => `translate(${projection(d.geometry.coordinates)})`)
    //     .attr('fill', 'red')
    //     .attr('stroke', 'black')
    //     .attr('stroke-width', 1);

    //   // 增加鼠标事件
    //   svg
    //     .selectAll('path')
    //     .on('pointerover', function (event, d) {
    //       // Show Tooltip
    //       d3.select(this).attr('fill', 'red');
    //       const tooltip = svg.append('g').attr('class', 'tooltip').style('pointer-events', 'none');
    //       tooltip
    //         .append('rect')
    //         .attr('width', 100)
    //         .attr('height', 30)
    //         .attr('fill', 'white')
    //         .attr('stroke', 'gray')
    //         .attr('stroke-width', 1);
    //       tooltip.append('text').attr('x', 5).attr('y', 20).text(d.properties.name);
    //       const [x, y] = d3.pointer(event);
    //       tooltip.attr('transform', `translate(${x + 10},${y + 20})`);
    //     })
    //     .on('pointermove', function (event) {
    //       const [x, y] = d3.pointer(event);
    //       svg.select('.tooltip').attr('transform', `translate(${x + 10},${y + 20})`);
    //     })
    //     .on('pointerout', function () {
    //       // Hide Tooltip
    //       d3.select(this).attr('fill', 'lightgray');
    //       svg.select('.tooltip').remove();
    //     });
  });
}

  useEffect(() => {
    requestPriceMapOneData()
  }, []);

  const width = 800;
  const height = 600;

  return <svg ref={svgRef} width={width} height={height}></svg>;
};

export default Map;

//       const areaArray = shapeTal.shape.map(({ width, height }) => width * height);
//       console.log(areaArray);
// console.log(projection,'projection')

// const area = geojson.features.map(feature => {
//   const { width, height } = feature.properties;
//   return width * height;

// });


// const symbol = d3
//   .symbol()
//   .type(d3.symbolSquare)
//   .size((d, i) => areaArray[i]);
// // 创建地理路径生成器
// const path = d3.geoPath().projection(projection);
// console.log(symbol());
// // 绘制地图路径
// svg
//   .selectAll('path')
//   .data(geojson.features)
//   .enter()
//   .append('path')
//   .attr('d', symbol)
//   .attr('transform', (d) => `translate(${[projection(d.geometry.coordinates)[0], projection(d.geometry.coordinates)[1]]})`)
//   .attr('fill', 'red')
//   .attr('stroke', 'black')
//   .attr('stroke-width', 1);


// svg
//   .selectAll('path')
//   .on('pointerover', function (event, d) {
//     d3.select(this).attr('fill', 'red');
//     const tooltip = svg.append('g').attr('class', 'tooltip').style('pointer-events', 'none');
//     tooltip
//       .append('rect')
//       .attr('width', 100)
//       .attr('height', 30)
//       .attr('fill', 'white')
//       .attr('stroke', 'gray')
//       .attr('stroke-width', 1);
//     tooltip.append('text').attr('x', 5).attr('y', 20).text(d.properties.name);
//     const [x, y] = d3.pointer(event);
//     console.log(x, y);
    
//     tooltip.attr('transform', `translate(${x + 10},${y + 20})`);
//   })
//   .on('pointermove', function (event) {
//     const [x, y] = d3.pointer(event);
//     console.log(x, y);
//     svg.select('.tooltip').attr('transform', `translate(${x + 10},${y + 20})`);
//   })
//   .on('pointerout', function () {
//     // Hide Tooltip
//     d3.select(this).attr('fill', 'lightgray');
//     svg.select('.tooltip').remove();
//   });
