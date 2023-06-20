import React from 'react';
import * as d3 from 'd3';
import cn from 'classnames';
import { FeatureCollection } from 'geojson';
import style from './index.module.css';
import Legend from '../legend';
import { convert } from '../../common/utils';
import Selecter from '../select';
import {
  getNetVrkMap
} from '../../service';

interface Props {
  zoomLimit?: Array<number>;
  initZoom?: number;
  zoomControl?: boolean;
  onClick?: () => void;
  dragging?: boolean;
  backColor?: string;
  changeTypeControl?: boolean;
  clickToJump?: boolean;
  fullScreenOnClick?: (show) => void;
  loadFinish?: () => void;
  withPopup?: boolean;
  defaultStatic?: string;
}

const mapT = [{ value: 'PRICE', label: 'PRICE' }];
const defalutColor = 'rgba(101, 128, 134, 1)';
const options = {
  PRICE: [
    { label: 'MONTH', value: 'MONTH' },
    { label: 'QUARTER', value: 'QUARTER' },
    { label: 'YEAR', value: 'YEAR' },
    { label: 'All-Time', value: 'ALL' },
  ],
  TRAFFIC: [
    { label: 'WEEKLY', value: 'WEEKLY' },
    { label: 'MONTHLY', value: 'MONTHLY' },
    { label: 'All-Time', value: 'TOTAL' },
  ],
};

const colors = {
  2: [{
      label: 'Top 10%',
      color: '#FFFFFF',
      TOTAL: { start: 0, end: 0 },
      MONTHLY: { start: 0, end: 0 },
      WEEKLY: { start: 0, end: 0 },
      ALL: { start: 0, end: 0 },
      MONTH: { start: 0, end: 0 },
      YEAR: { start: 0, end: 0 },
      QUARTER: { start: 0, end: 0 },
    },{
      label: '11%-20%',
      color: '#BEFBFF',
      TOTAL: { start: 0, end: 0 },
      MONTHLY: { start: 0, end: 0 },
      WEEKLY: { start: 0, end: 0 },
      ALL: { start: 0, end: 0 },
      MONTH: { start: 0, end: 0 },
      YEAR: { start: 0, end: 0 },
      QUARTER: { start: 0, end: 0 },
    },{
      label: '21%-30%',
      color: '#54F5FF',
      TOTAL: { start: 0, end: 0 },
      MONTHLY: { start: 0, end: 0 },
      WEEKLY: { start: 0, end: 0 },
      ALL: { start: 0, end: 0 },
      MONTH: { start: 0, end: 0 },
      YEAR: { start: 0, end: 0 },
      QUARTER: { start: 0, end: 0 },
    },{
      label: '31%-40%',
      color: '#0BCEDB',
      TOTAL: { start: 0, end: 0 },
      MONTHLY: { start: 0, end: 0 },
      WEEKLY: { start: 0, end: 0 },
      ALL: { start: 0, end: 0 },
      MONTH: { start: 0, end: 0 },
      YEAR: { start: 0, end: 0 },
      QUARTER: { start: 0, end: 0 },
    },{
      label: '41%-50%',
      color: '#0F8B9C',
      TOTAL: { start: 0, end: 0 },
      MONTHLY: { start: 0, end: 0 },
      WEEKLY: { start: 0, end: 0 },
      ALL: { start: 0, end: 0 },
      MONTH: { start: 0, end: 0 },
      YEAR: { start: 0, end: 0 },
      QUARTER: { start: 0, end: 0 },
    },{
      label: '51%-65%',
      color: '#05616D',
      TOTAL: { start: 0, end: 0 },
      MONTHLY: { start: 0, end: 0 },
      WEEKLY: { start: 0, end: 0 },
      ALL: { start: 0, end: 0 },
      MONTH: { start: 0, end: 0 },
      YEAR: { start: 0, end: 0 },
      QUARTER: { start: 0, end: 0 },
    },{
      label: '66%-80%',
      color: '#004049', // 'rgb(31,84,133)', //
      TOTAL: { start: 0, end: 0 },
      MONTHLY: { start: 0, end: 0 },
      WEEKLY: { start: 0, end: 0 },
      ALL: { start: 0, end: 0 },
      MONTH: { start: 0, end: 0 },
      YEAR: { start: 0, end: 0 },
      QUARTER: { start: 0, end: 0 },
    },{
      label: '81%-100%',
      color: '#002F32', // 'rgb(3,46,118)', //
      TOTAL: { start: 0, end: 0 },
      MONTHLY: { start: 0, end: 0 },
      WEEKLY: { start: 0, end: 0 },
      ALL: { start: 0, end: 0 },
      MONTH: { start: 0, end: 0 },
      YEAR: { start: 0, end: 0 },
      QUARTER: { start: 0, end: 0 },
    },
  ],
};

const Map = (
  {
    zoomLimit,
    zoomControl,
    initZoom = zoomLimit[0],
    onClick,
    dragging = true,
    backColor = 'black',
    changeTypeControl = true,
    clickToJump = false,
    fullScreenOnClick,
    loadFinish,
    withPopup = true,
    defaultStatic = 'price',
  }: Props) => {
    const mousedownTimestamp = React.useRef(0);
  const svgRef = React.useRef(null);
  const popDetail = React.useRef();
  const legends = React.useRef(colors[2]);
  const mapType = React.useRef(defaultStatic.toUpperCase() || 'PRICE');
  const staticType = React.useRef('ALL');
  const [staticList, setStaticList] = React.useState(options[mapType.current]);
const [zoomLevel, setZoomLevel] = React.useState(initZoom);
const [showPopup, setShowPopup] = React.useState(false);
const allMesh = React.useRef(null);
const [minZoomLevel, setMinZoomLevel] = React.useState(zoomLimit[0]);
  const [maxZoomLevel, setMaxZoomLevel] = React.useState(zoomLimit[1]);
  const [fullScreen, setFullScreen] = React.useState(false);
  const [activeColor, setActiveColor] = React.useState(null);
  const [mouseX, setMouseX] = React.useState(-1);
  const [mouseY, setMouseY] = React.useState(-1);
  const [positionX, setPositionX] = React.useState(0);
  const [versionNumber, setVersionNumber] = React.useState(0);
  const [positionY, setPositionY] = React.useState(0);

  const [selectedTimeRange, setSelectedTimeRange] =  React.useState(null); // 初始值为空
  const detailPosition = React.useRef({
    parcel: null,
    x: null,
    y: null,
    z: null,
  });
const lastDragX = React.useRef(-1);
const lastDragY = React.useRef(-1);
const detailY = React.useRef(0);
const detailX = React.useRef(0);
  const onMapChange = React.useCallback(
    ({ zoom: z, nw, se, center }) => {
      if (z !== zoomLevel) {
        // closePop();
        setZoomLevel(z);
      }
      if (z > maxZoomLevel) {
        setZoomLevel(maxZoomLevel);
        return;
      }
      if (z < minZoomLevel) {
        setZoomLevel(minZoomLevel);
      }
    },
    [zoomLevel, maxZoomLevel, minZoomLevel]
  );

  const mapWidth = 1200; // 假设地图内容的宽度为 1000
const mapHeight = 1000; // 假设地图内容的高度为 800

const scaleX = 1000 / mapWidth;
const scaleY = 800 / mapHeight;
const minScale = Math.min(scaleX, scaleY);
const maxScale = 2; // 设置最大比例为2

const [scaleA, setScaleA] = React.useState(minScale);
const [nameCont, setNameCont] = React.useState(null);
const [zoomCount, setZoomCount] =  React.useState(0);

// const getSelectedColor = () => {
//   let matchedColor = null;

//   if (staticList === 'ALL') {
//     matchedColor = colors[2][0].color;
//   } else if (staticList === 'MONTH') {
//     matchedColor = colors[2][1].color;
//   } else if (staticList === 'QUARTER') {
//     matchedColor = colors[2][2].color;
//   } else if (staticList === 'YEAR') {
//     matchedColor = colors[2][3].color;
//   }

//   return matchedColor;
// };


const updateMatchedColors = () => {
  const matchedColors = selectedTimeRange.map((priceData) => {
    let matchedColor = null;

    for (let i = 0; i < colors[2].length; i += 1) {
      const currentColorData = colors[2][i];

      if (
        staticType.current === 'ALL' &&
        priceData.all >= currentColorData.ALL.end &&
        priceData.all <= currentColorData.ALL.start
      ) {
        matchedColor = currentColorData.color;
        break;
      } else if (
        staticType.current === 'MONTH' &&
        priceData.month >= currentColorData.MONTH.end &&
        priceData.month <= currentColorData.MONTH.start
      ) {
        matchedColor = currentColorData.color;
        break;
      } else if (
        staticType.current === 'QUARTER' &&
        priceData.quarter >= currentColorData.QUARTER.end &&
        priceData.quarter <= currentColorData.QUARTER.start
      ) {
        matchedColor = currentColorData.color;
        break;
      } else if (
        staticType.current === 'YEAR' &&
        priceData.year >= currentColorData.YEAR.end &&
        priceData.year <= currentColorData.YEAR.start
      ) {
        matchedColor = currentColorData.color;
        break;
      }
    }

    return matchedColor;
  });

  // 更新匹配颜色数组
  // 例如：setMatchedColors(matchedColors);
};


const requestPriceMapOneData = React.useCallback(()=>{
  // console.log(staticType.current);
  
  const svg = d3.select(svgRef.current)
  const gMap = svg.append('g').attr('id', 'gMap');
  const res = getNetVrkMap();
  
  res.then((resDA)=>{
  d3.csv('https://nft.netvrk.co/data/data.csv').then((data) => {
    // console.assert(gMap, 'gMap element is undefined or null');
    // console.assert(gMap.attr('transform'), 'gMap element does not have attribute transform');
    // console.log('zoomScale called');
    // const zoomScale = d3.zoom().on('zoom', () => {
 
    //   // 判断 attr 是否存在，以便在第一次缩放和移动的时候设置默认的值
    //   const currentTransform = gMap.attr('transform') || 'translate(0,0) scale(1)';
    //   console.log(currentTransform);
    
    //   const { x, y, k } = d3.event.transform;
    //   gMap.attr('transform', `translate(${x},${y}) scale(${k})`);

    //   const scaleRegex = /scale\(([\d.]+)\)/;
    //   const scaleMatch = currentTransform.match(scaleRegex);
    //   const scale = scaleMatch ? parseFloat(scaleMatch[1]) : 1;
    //   console.log(`currentTransform=${currentTransform}, scale=${scale}`);
    // });
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
        const lengthUnit = resDA.data.parcels.map((item)=>{
      const { weight , height } = item.properties;
    
      return [parseFloat(weight), parseFloat(height)]
        })
        const idArea =  resDA.data.parcels.map((item)=>{
          // console.log(item);
          const { name } = item.properties;
          setNameCont(name)
          return name;
        })
        // console.log(idArea);

        const price = convert( resDA.data.stats?.price);
        if (price.levelOne) {
          // console.log(price.levelOne,66666666666666);
          
          colors[2].forEach(function (item, index) {
            Object.assign(item.ALL, price.levelOne[index].all);
            Object.assign(item.MONTH, price.levelOne[index].month);
            Object.assign(item.QUARTER, price.levelOne[index].quarter);
            Object.assign(item.YEAR, price.levelOne[index].year);
          });
        }
      //   const heightEach = resDA.data.parcels.map((item)=>{
      // // console.log(item)
      // const { height } = item.properties;
    
      // return parseFloat(height);
      //   })
        
// let coordinatesX;
// let coordinatesY;
const coordinatesNum = resDA.data.parcels.map((parcel) => {
// 使用数组解构获取 coordinates 数组中的第一个值和第二个值
const [coordinatesX, coordinatesY] = parcel.geometry.coordinates;

// const a = [0.7071046 ,-0.707109, 0.707109, 0.7071046 ,-718.9200439, 2943.7104492]
// console.log(a);
// const coordinatesXF = 7071046*coordinatesX+707109*coordinatesY-718.9200439
// const coordinatesYF = -0.707109*coordinatesX+0.7071046*coordinatesY+2943.7104492
// console.log(coordinatesXF,coordinatesYF);
// console.log(coordinatesX, coordinatesY);

return[coordinatesX, coordinatesY]
});

const priceNum = resDA.data.parcels.map(item => {
  const { month, quarter, year, all } = item.price;
  return { month, quarter, year, all };
});

// console.log(priceNum);
// setSelectedTimeRange(priceNum)
// const matchedColors = priceNum.map(item => {
//   const { start, end } = item.all;
  
//   const matchedColor = colors[2].find(color => 
    
//     color.ALL.start <= start && color.ALL.end >= end 
//   );
  
//   return matchedColor ? matchedColor.color : defalutColor;
// });

// const matchedColors = priceNum.map(priceData => {
//   let matchedColor = null;
  
//   for (let i = 0; i < colors[2].length; i+=1) {
//     const currentColorData = colors[2][i];
    
//     if (priceData.all >= currentColorData.ALL.end && priceData.all <= currentColorData.ALL.start) {
//       matchedColor = currentColorData.color;
//       break; // 匹配到颜色后跳出循环
//     } else if (priceData.month >= currentColorData.MONTH.end && priceData.month <= currentColorData.MONTH.start) {
//       matchedColor = currentColorData.color;
//       break;
//     } else if (priceData.quarter >= currentColorData.QUARTER.end && priceData.quarter <= currentColorData.QUARTER.start) {
//       matchedColor = currentColorData.color;
//       break;
//     } else if (priceData.year >= currentColorData.YEAR.end && priceData.year <= currentColorData.YEAR.start) {
//       matchedColor = currentColorData.color;
//       break;
//     }
//   }
  
//   return matchedColor;
// });

const matchedColors = priceNum.map((priceData) => {
  let matchedColor = null;

  for (let i = 0; i < colors[2].length; i += 1) {
    const currentColorData = colors[2][i];

    // Match the corresponding condition based on the option's value
    if (
      staticType.current === 'ALL' &&
      priceData.all >= currentColorData.ALL.end &&
      priceData.all <= currentColorData.ALL.start
    ) {
      matchedColor = currentColorData.color;
      break;
    } else if (
      staticType.current === 'MONTH' &&
      priceData.month >= currentColorData.MONTH.end &&
      priceData.month <= currentColorData.MONTH.start
    ) {
      matchedColor = currentColorData.color;
      break;
    } else if (
      staticType.current === 'QUARTER' &&
      priceData.quarter >= currentColorData.QUARTER.end &&
      priceData.quarter <= currentColorData.QUARTER.start
    ) {
      matchedColor = currentColorData.color;
      break;
    } else if (
      staticType.current === 'YEAR' &&
      priceData.year >= currentColorData.YEAR.end &&
      priceData.year <= currentColorData.YEAR.start
    ) {
      matchedColor = currentColorData.color;
      break;
    }
  }

  return matchedColor;
});


// const matchedColors = priceNum.map(priceData => {
//   let matchedColor = null;

//   // 根据selectedTimeRange选择对应的时间范围进行匹配
//   const currentColorData = colors[2].find(colorData => {
//     if (selectedTimeRange === 'ALL') {
//       return priceData.all >= colorData.ALL.end && priceData.all <= colorData.ALL.start;
//     }
//     if (selectedTimeRange === 'MONTH') {
//       return priceData.month >= colorData.MONTH.end && priceData.month <= colorData.MONTH.start;
//     }
//     if (selectedTimeRange === 'QUARTER') {
//       return priceData.quarter >= colorData.QUARTER.end && priceData.quarter <= colorData.QUARTER.start;
//     }
//     if (selectedTimeRange === 'YEAR') {
//       return priceData.year >= colorData.YEAR.end && priceData.year <= colorData.YEAR.start;
//     }
//     return false; // Default return statement if none of the conditions match
//   });

//   if (currentColorData) {
//     matchedColor = currentColorData.color;
//   }

//   return matchedColor;
// });




// console.log(matchedColors);

const matrixNum = resDA.data.parcels.map((parcel) => {
  // 使用数组解构获取 coordinates 数组中的第一个值和第二个值
  const [matrixOne, matrixTwo,matrixThree,matrixNumFour,matrixFive,matrixSix] = parcel.geometry.matrix;
  const matrixNumEach = parcel.geometry.matrix.map(str => str.split(',').map(parseFloat));
  const matrixNumC = matrixNumEach.flat().map(parseFloat);
  return[matrixNumC]
  });
    const symbol = d3
      .symbol()
      .type(d3.symbolSquare)

      .size((d, i) => area[i]);
const svgWidth = '100%'
const svgHeight  = '100%'
    // 创建地理路径生成器
    const path = d3.geoPath().projection(projection);
 
     // 创建缩放对象
    //  const zoom = d3.zoom().on('zoom', () => {
    //   svg.attr('transform', d3.event.transform); // 更新 SVG 元素的 transform 属性
    // });


    // const dragBehavior = d3.drag().on('drag', (event) => {
    //   const [x, y] = d3.pointer(event);
    //   // console.log(x, y);
    //   svg.select('#gMap').attr('transform', `translate(${x},${y})`);
    //   // console.log(22222222222, svg.attr('transform', `translate(${x},${y})`));
      
    //   // svg.attr('transform', d3.event.transform);
      
    // });

 // 定义拖动事件的初始坐标
 let lastTranslation = [0, 0];
 let offset = [0, 0];
 
 const dragBehavior = d3.drag()
   .subject(() => {
     const gMapNode = svgRef.current.querySelector("#gMap");
     const transform = (gMapNode && gMapNode.getAttribute('transform')) || 'translate(0, 0)';
     
     const defaultTransform = 'translate(0, 0)';
     const finalTransform = transform || defaultTransform;
     
     const [x, y] = finalTransform.match(/(-*\d+(\.\d+)?)/g) || [0, 0];
     lastTranslation = [parseInt(x, 10), parseInt(y, 10)];
     
     // Reset offset between drags
     offset = [0, 0];
     
     return { x: lastTranslation[0], y: lastTranslation[1] };
   })
   .on('drag', (event) => {
     const gMapNode = svgRef.current.querySelector("#gMap");
     const [x, y] = d3.pointer(event);
 
     offset = [offset[0] + event.dx, offset[1] + event.dy];
     const newX = lastTranslation[0] + offset[0];
     const newY = lastTranslation[1] + offset[1];
 
     d3.select(gMapNode).attr('transform', `translate(${newX}, ${newY})`);
   })
   .on('end', () => {
     const [x, y] = lastTranslation;
     lastTranslation = [x - offset[0], y - offset[1]];
   });


  //  const zoomBehavior = d3.zoom()
  // .scaleExtent([0.5, 2]) // 设置缩放范围
  // .on("zoom", (event) => {
  //   // 获取缩放事件的缩放比例和平移坐标
  //   const { transform } = event;
  //   // 在 gMap 元素上应用缩放和平移变换
  //   gMap.attr("transform", transform);
  // });
   

// // 记录上一个拖动事件结束时的坐标
// let lastX = 0;
// let lastY = 0;
// const dragBehavior = d3.drag()
// .on('drag', (event) => {
//   const newX = d3.pointer(event)[0];
//   const newY = d3.pointer(event)[1];
//   const deltaX = newX - lastX;
//   const deltaY = newY - lastY;
//   svg.select('#gMap')
//     .attr('transform', `translate(${deltaX}, ${deltaY})`)
//     .attrTween('transform', () => d3.interpolateString(`translate(${deltaX}, ${deltaY})`, `translate(0, 0)`).ease(d3.easeLinear));
//   lastX = newX;
//   lastY = newY;
// })
// .on('start', (event) => {
//   let [lastXq, lastYq] = d3.pointer(event);
//   [lastXq, lastYq]= d3.pointer(event);
//   svg.select('#gMap')
//     .attr('transform', `translate(${lastXq}, ${lastYq})`)
//     .attrTween('transform', () => d3.interpolateString(`translate(${lastXq}, ${lastYq})`, `translate(0, 0)`).ease(d3.easeLinear));
// })

// const gElement = svg.select('g'); // Assuming the <g> element already exists

// // Step 1: Compute overall width and height of <g> element
// const overallWidth = d3.max(resDA.data.parcels, (d, i) => coordinatesNum[i][0] + lengthUnit[i][0]);
// const overallHeight = d3.max(resDA.data.parcels, (d, i) => coordinatesNum[i][1] + lengthUnit[i][1]);

// // Step 2: Calculate offset for centering
// const offsetX = (mapWidth - overallWidth) / 2;
// const offsetY = (mapHeight - overallHeight) / 2;

// // Step 3: Apply offset to the <g> element
// gElement.attr('transform', `translate(${offsetX}, ${offsetY})`);
// const matchedColors = priceNum.map((item, i) => colors[2][i] || defalutColor);
// console.log(matchedColors);







    // 绘制地图路径
    gMap
    // .call(zoomScale)
      // .call(zoom)
      .selectAll('rect')
      .data(resDA.data.parcels)
      .enter()
      .append('rect')
      .attr('class', 'web-annotation')
      // .attr('d', symbol)
      .attr('id', (d, i) => idArea[i])
      .attr('viewBox', `0 0 ${svgWidth} ${svgHeight}`)
      .attr('x', (d, i) => coordinatesNum[i][0])
      .attr('y', (d, i) => coordinatesNum[i][1])
      .attr('width', (d, i) => lengthUnit[i][0])
      .attr('height', (d, i) => lengthUnit[i][1])
  
      .attr('transform', (d, i) => {
        const matrixValue = matrixNum[i][0];
        const isMatrixNaN = matrixValue.some(value => Number.isNaN(value));
        if (isMatrixNaN) {
          return 'matrix(1 0 0 1 0 0)'; // Default matrix value
        }
        const transformString = `matrix(${matrixValue.join(' ')})`;
        return transformString;
      })
      // .attr('fill', (d, i) => colors[2][i])
      .attr('fill', (d, i) => matchedColors[i])
      .attr('stroke', 'white')
      .attr('stroke-width', 1)
      svg.call(dragBehavior).select('g').attr('transform', 'translate(-2151, -2190)');
      // svg.call(zoomBehavior);
      // gMap.call(zoomScale);
       // 应用缩放对象
      //     svg.call(onMapChange);
      // console.log(d3,3333333333333333);


      const containerElement = document.getElementById('container'); 
      let [xaa, yaa] = [0, 0]; // 初始化鼠标位置
      
      let tooltip = null; // 存储文本框元素的引用
      
      svg.selectAll('rect')
        .on('mouseover', function (event, d) {
          // d3.select(this).attr('fill', 'red');
          tooltip = svg.append('g')
            .attr('class', 'tooltip')
            .style('pointer-events', 'none');
      
            tooltip.append('rect')
            .attr('width', 180)
            .attr('height', 30)
            .attr('fill', 'transparent') // 设置背景色为透明
            .attr('stroke', 'white') // 设置边框颜色为白色
            .attr('stroke-width', 1) // 设置边框线宽度为1
            .attr('rx', '6') // 设置圆角半径为6px（根据宽度的20%）
            .attr('ry', '6')
            .attr('text-anchor', 'middle'); // 设置文本在矩形框内居中
          
          tooltip.append('text')
            .attr('x', 90) // 将文本的 x 坐标设置为矩形的一半，使其居中
            .attr('y', 20)
            .text(d.properties.name)
            .style('font-family', 'Arial') // 修改为所需的字体
            .style('fill', '#fff') // 修改为所需的颜色
            .style('font-size', '20px') // 修改为所需的字体大小
            .style('text-anchor', 'middle'); // 设置文本在矩形框内居中
          
          tooltip.attr('transform', `translate(${xaa - 10},${yaa - 10})`);
        })
        .on('mousemove', function (event) {
          tooltip.attr('transform', `translate(${xaa - 380},${yaa + 180})`);
        })
        .on('mouseout', function () {
          // d3.select(this).attr('fill', 'lightgray');
          tooltip.remove();
        });
      
      containerElement.addEventListener('mousemove', (eventX) => {
        const { clientX, clientY } = eventX;
        const containerRect = containerElement.getBoundingClientRect();
        xaa = clientX - containerRect.left;
        yaa = clientY - containerRect.top;
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
}, [staticType.current]);


// React.useEffect(() => {
//   console.log(nameCont);
// }, [nameCont]);


// React.useEffect(() => {

//   function handleMouseMove(event: MouseEvent) {
//     if (showPopup && mouseX === -1 && mouseY === -1) {
//       setMouseX(event.offsetX);
//       setMouseY(event.offsetY);
//       setPositionX(event.offsetX);
//       setPositionY(event.offsetY);
//     }
//   }

//   if (withPopup) {
//     document.addEventListener('mousemove', handleMouseMove);
//   }

//   return () => {
//     if (withPopup) {
//       document.removeEventListener('mousemove', handleMouseMove);
//     }
//   };
// }, [withPopup, showPopup, mouseX, mouseY]);


const closePop = React.useCallback(() => {
  // setShowDetail(false);
  // setSelectTile(null);
  // setActiveColor(null);
}, [null]);

// // const Chart = () => {
// //   // 获取 SVG 画布的引用
// //   const svgRefA = React.useRef(null);

// //   // 定义画布的大小
//   const [width, setWidth] = React.useState(0);
//   const [height, setHeight] = React.useState(0);

//   // 监听容器元素的大小变化
//   React.useEffect(() => {
//     const containerElem = document.getElementById('container');
//     const resizeHandler = () => {
//       setWidth(containerElem.clientWidth);
//       setHeight(containerElem.clientHeight);
//     }
//     resizeHandler(); // 初始化画布大小
//     window.addEventListener('resize', resizeHandler);
//     return () => window.removeEventListener('resize', resizeHandler);
//   }, []);

//   return (
//     <div id="container" style={{width: '100%', height: '100%'}}>
//       <svg ref={svgRefA} viewBox={`0 0 ${width} ${height}`} width="100%" height="100%">
//         {/* SVG 内容 */}
//       </svg>
//     </div>
//   );
// };



React.useEffect(() => {
  // console.log(11111);
  // console.log(staticType.current);
  
    requestPriceMapOneData()
  }, [staticType.current]);

  // const zoomButtonClick = (type) => {
  //   // if (clickCount < 5) {
  //     let newScale;
  //     if (type === 'zoomIn') {
  //       newScale = scaleA + 0.2;
  //     } else {
  //       newScale = scaleA - 0.2;
  //     }
      
  //     // 将 newScale 限制在最小和最大比例之间
  //     if (newScale < minScale) {
  //       newScale = minScale;
  //     } else if (newScale > maxScale) {
  //       newScale = maxScale;
  //     }

  //     setScaleA(newScale);
  //     setClickCount(prevCount => prevCount + 1);
  //   // }
  // };
    

  const full = React.useCallback(async () => {
    const isFull = !fullScreen;
    const s = await fullScreenOnClick(isFull);
    setFullScreen(isFull);
  }, [fullScreen, fullScreenOnClick]);
  

  const handleZoomIn = () => {
    const newScale = Math.min(scaleA + 0.2, maxScale);
    setScaleA(newScale);
    setZoomCount(prevCount => prevCount + 1);
  };

  const handleZoomOut = () => {
    const newScale = Math.max(scaleA - 0.2, minScale);
    setScaleA(newScale);
    setZoomCount(prevCount => prevCount + 1);
  };

  // const getSingleColor = React.useCallback(
  //   (fe) => {
  //     let color = defalutColor;
  //     let count = fe.attr[staticType.current.toLocaleLowerCase()];
  //     let index = -1;
  //     if (!Number.isNaN(count) && legends.current) {
  //       count = count < 0 ? 0 : count;
  //       index = legends.current.findIndex((x) => {
  //         return count <= x[staticType.current].start && count >= x[staticType.current].end;
  //       });
  //       if (index > -1) {
  //         const allColor = legends.current[index];
  //         /* eslint no-underscore-dangle: 0 */
  //         fe.attr.colorIndex = index; // eslint-disable-line
  //         color = allColor.color;
  //       }
  //     }
  //     return {
  //       color,
  //       index,
  //     };
  //   },
  //   [null],
  // );

  // const setColor = React.useCallback(
  //   (insMesh, acColor?) => {
  //     if (!insMesh) {
  //       return;
  //     }
  //     let result;
  //     if (!acColor) {
  //       const { color } = getSingleColor(insMesh.userData);
  //       result = color;
  //     } else {
  //       result = acColor;
  //     }
  //     insMesh.material.color.set(result); // eslint-disable-line
  //     insMesh.material.needsUpdate = true; // eslint-disable-line
  //   },
  //   [getSingleColor],
  // );

  // const clearHeightLight = () => {
  //   if (detailPosition.current.parcel) {
  //     setColor(detailPosition.current.parcel);
  //     detailPosition.current.parcel = null;
  //   }
  // };
  // const closePop = React.useCallback(() => {
  //   if (popDetail.current) {
  //     (popDetail.current as any).style.display = 'none';
  //   }
  //   setActiveColor(null);
  //   clearHeightLight();
  // }, [popDetail.current, clearHeightLight]);
  // const changeMapType = React.useCallback(
  //   (newType) => {
  //     mapType.current = newType;
  //     setStaticList(options[newType]);
  //     staticType.current = options[newType][1].value;
  //     closePop();
  //   },
  //   [null],
  // );



  const changeStaticType = React.useCallback((value)=>{
    // console.log(5555555555);
    staticType.current =value;

    // console.log(staticType.current,'有没有变化');
    requestPriceMapOneData()
  },[staticType.current]
  );

  return (
    <>
     <div className={cn('flex justify-between items-center', style.picker)}>
        {/* <div className={cn('flex justify-center items-center', style.type)}>TRAFFIC</div> */}
        <Selecter
          options={mapT}
          // onClick={changeMapType}
          showArrow={false}
          defaultLabel={mapType.current}
        ></Selecter>
        <div className={style.dividing}></div>
        <Selecter
          options={staticList}
          onClick={changeStaticType}
          showArrow={changeTypeControl}
          defaultLabel={staticType.current}
        ></Selecter>
      </div>
    {zoomControl ? (
      <>
        <div className={cn('flex flex-col', style.zoom)}>
          <button
            className={cn('flex justify-center items-center', style.zoomButton)}
            onClick= {handleZoomIn}
            disabled={scaleA ===2}
          >
            <img
              className={zoomLevel >= maxZoomLevel ? style.disable : null}
              src="./images/Union.png"
            ></img>
          </button>
          <button
            className={cn('flex justify-center items-center', style.zoomButtonrEACT)}
            onClick= {handleZoomOut}
             disabled={scaleA ===0.8}
          >
            <img
              className={zoomLevel <= minZoomLevel ? style.disable : null}
              src="./images/Rectangle.png"
            ></img>
          </button>
        </div>
        <div
          className={cn('text-white absolute flex justify-center items-center', style.fullBtn)}
          onClick={full}
        >
          <img src={`./images/${fullScreen ? 'unfull.png' : 'full.png'}`}></img>
        </div>
      </>
    ) : null}
  
  <div id="container" className={style.map} style={{ backgroundColor: backColor }}
  // onMouseDown={dragging ? handleDrag : null}
  // onMouseMove={handleMouseMove}
  >
  <svg   
  preserveAspectRatio="xMidYMid meet" 
  ref={svgRef}  
  style={{ width: '100%', height: '100%', position:'relative',transform: `scale(${scaleA})` }} 
  viewBox={`0 0 ${mapWidth} ${mapHeight}`}
   width="100%" height="100%"
   >
  </svg>
  {/* <div
      className={style.textBox}
      style={{ left: textBoxPosition.x, top: textBoxPosition.y }}
    >
      {nameCont}
    </div> */}
</div>


   {/* <div id="container" className={style.map} style={{ backgroundColor: backColor }} onMouseDown={dragging ? handleDrag : null}>
  <svg
    preserveAspectRatio="xMidYMid meet"
    ref={svgRef}
    style={{
      width: '100%',
      height: '100%',
      transform: `scale(${scaleA})`,
      transformOrigin: 'center',
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)'
    }}
    viewBox={`-${mapWidth / 2} -${mapHeight / 2} ${mapWidth} ${mapHeight}`}
    width="100%"
    height="100%"
  >
    <g id="gMaps">
      地图内容
    </g>
  </svg>
</div> */}
   <Legend
        className={style.legend}
        title={mapType.current === 'TRAFFIC' ? 'Traffic ranking' : 'Price ranking'}
        options={legends.current}
        active={activeColor}
      ></Legend>
  </>
  )
  ;
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





// const requestPriceMapOneData = ()=>{
//   const svg = d3.select(svgRef.current)
//   const gMap = svg.append('g').attr('id', 'gMap');
//   const res = getNetVrkMap();
//   res.then((resDA)=>{
//   d3.csv('https://nft.netvrk.co/data/data.csv').then((data) => {
//     const projection = d3.geoMercator();
// const svgWidth = '100%'
// const svgHeight  = '100%'
//  // 定义拖动事件的初始坐标
//  let lastTranslation = [0, 0];
//  let offset = [0, 0];
//  const dragBehavior = d3.drag()
//    .subject(() => {
//      const gMapNode = svgRef.current.querySelector("#gMap");
//      const transform = (gMapNode && gMapNode.getAttribute('transform')) || 'translate(0, 0)';
//      const defaultTransform = 'translate(0, 0)';
//      const finalTransform = transform || defaultTransform;
//      const [x, y] = finalTransform.match(/(-*\d+(\.\d+)?)/g) || [0, 0];
//      lastTranslation = [parseInt(x, 10), parseInt(y, 10)];
//      offset = [0, 0];
     
//      return { x: lastTranslation[0], y: lastTranslation[1] };
//    })
//    .on('drag', (event) => {
//      const gMapNode = svgRef.current.querySelector("#gMap");
//      const [x, y] = d3.pointer(event);
 
//      offset = [offset[0] + event.dx, offset[1] + event.dy];
//      const newX = lastTranslation[0] + offset[0];
//      const newY = lastTranslation[1] + offset[1];
 
//      d3.select(gMapNode).attr('transform', `translate(${newX}, ${newY})`);
//    })
//    .on('end', () => {
//      const [x, y] = lastTranslation;
//      lastTranslation = [x - offset[0], y - offset[1]];
//    });
//     // 绘制地图路径
//     gMap
//     // .call(zoomScale)
//       // .call(zoom)
//       .selectAll('rect')
//       .data(resDA.data.parcels)
//       .enter()
//       .append('rect')
//       .attr('class', 'web-annotation')
//       // .attr('d', symbol)
//       .attr('id', (d, i) => idArea[i])
//       .attr('viewBox', `0 0 ${svgWidth} ${svgHeight}`)
//       .attr('x', (d, i) => coordinatesNum[i][0])
//       .attr('y', (d, i) => coordinatesNum[i][1])
//       .attr('width', (d, i) => lengthUnit[i][0])
//   .attr('height', (d, i) => lengthUnit[i][1])
  
//       .attr('transform', (d, i) => {
//         const matrixValue = matrixNum[i][0];
//         const isMatrixNaN = matrixValue.some(value => Number.isNaN(value));
//         if (isMatrixNaN) {
//           return 'matrix(1 0 0 1 0 0)'; // Default matrix value
//         }
//         const transformString = `matrix(${matrixValue.join(' ')})`;
//         return transformString;
//       })
//       .attr('fill', 'red')
//       .attr('stroke', 'white')
//       .attr('stroke-width', 1)
//       svg.call(dragBehavior)


//     // 添加拖动事件处理器
//     const dragHandler = d3
//       .drag()
//       .on('start', () => {
//         // 保存当前的 transform 属性值
//         const { x, y } = d3.event.transform;
//         dragHandler.lastX = x;
//         dragHandler.lastY = y;
//       })
//       .on('drag', () => {
//         // 获取当前的 transform 属性值
//         const { x, y } = d3.event.transform;

//         // 计算拖动的距离
//         const dx = x - dragHandler.lastX;
//         const dy = y - dragHandler.lastY;

//         // 更新 transform 属性值
//         svg.attr('transform', `translate(${x},${y})`);

//         // 保存最后的 transform 属性值
//         dragHandler.lastX = x;
//         dragHandler.lastY = y;
//       });

//     // 应用拖动事件处理器
//     svg.call(dragHandler);

    // 增加鼠标事件
//     svg
//       .selectAll('rect')
//       .on('pointerover', function (event, d) {
//         // Show Tooltip
//         d3.select(this).attr('fill', 'red');
//         const tooltip = svg.append('g').attr('class', 'tooltip').style('pointer-events', 'none');
//         tooltip
//           .append('rect')
//           .attr('width', 150) 
//           .attr('height', 30)
//           .attr('fill', 'white')
//           .attr('stroke', 'gray')
//           .attr('stroke-width', 1);
//         tooltip.append('text').attr('x', 5).attr('y', 20).text(d.properties.name);
//         const [x, y] = d3.pointer(event);
//         console.log(x, y);
//         //  const [x, y] = [event.pageX, event.pageY];
//         tooltip.attr('transform', `translate(${x + 10},${y + 20})`);
//       })
//       .on('pointermove', function (event) {
//         const [x, y] = d3.pointer(event);
//         // const [x, y] = [event.pageX, event.pageY];
//         console.log(x, y);
//         svg.select('.tooltip').attr('transform', `translate(${x + 10},${y + 20})`);
//       })
//       .on('pointerout', function () {
//         // Hide Tooltip
//         d3.select(this).attr('fill', 'lightgray');
//         svg.select('.tooltip').remove();
//       });


//     })  
      
//     //   const projection = d3.geoMercator();
//     //   const path = d3.geoPath().projection(projection);

//     //   // 创建不同形状的生成器
//     //   const square = d3.symbol().type(d3.symbolSquare);
//     //   const circle = d3.symbol().type(d3.symbolCircle);

//     //   // 提取数据中形状大小的最小和最大值
//     //   const [minSize, maxSize] = d3.extent(data, (d) => +d.shape);

//     //   // 为不同形状和大小创建不同路径
//     //   const symbols = {
//     //     square: (size) => square.size(size * size),
//     //     circle: (size) => circle.size(size * size),
//     //   };
//     // console.log(data);

//     //   // 绘制地图
//     //   svg
//     //     .selectAll('path')
//     //     .data(geojson.features)
//     //     .enter()
//     //     .append('path')
//     //     .attr('d', (d) => {
//     //       const { shape } = data?.find((datum) => datum.name === d.properties.name);
//     //        const symbol = symbols.square(shape); // 或者 symbols.circle(shape)
//     //        return path(symbol());
//     //     })
//     //     .attr('transform', (d) => `translate(${projection(d.geometry.coordinates)})`)
//     //     .attr('fill', 'red')
//     //     .attr('stroke', 'black')
//     //     .attr('stroke-width', 1);

//     //   // 增加鼠标事件
//     //   svg
//     //     .selectAll('path')
//     //     .on('pointerover', function (event, d) {
//     //       // Show Tooltip
//     //       d3.select(this).attr('fill', 'red');
//     //       const tooltip = svg.append('g').attr('class', 'tooltip').style('pointer-events', 'none');
//     //       tooltip
//     //         .append('rect')
//     //         .attr('width', 100)
//     //         .attr('height', 30)
//     //         .attr('fill', 'white')
//     //         .attr('stroke', 'gray')
//     //         .attr('stroke-width', 1);
//     //       tooltip.append('text').attr('x', 5).attr('y', 20).text(d.properties.name);
//     //       const [x, y] = d3.pointer(event);
//     //       tooltip.attr('transform', `translate(${x + 10},${y + 20})`);
//     //     })
//     //     .on('pointermove', function (event) {
//     //       const [x, y] = d3.pointer(event);
//     //       svg.select('.tooltip').attr('transform', `translate(${x + 10},${y + 20})`);
//     //     })
//     //     .on('pointerout', function () {
//     //       // Hide Tooltip
//     //       d3.select(this).attr('fill', 'lightgray');
//     //       svg.select('.tooltip').remove();
//     //     });
//   });
// }