import React from 'react';
import * as d3 from 'd3';
import cn from 'classnames';
import { FeatureCollection } from 'geojson';
import style from './index.module.css';
import Legend from '../legend';
import { convert } from '../../common/utils';
import Selecter from '../select';

import ParcelDeatil from '../netvrk_land_map_detail';

import {
  getNetVrkMap,
  getNetvrkDetail
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
      color: 'rgb(255, 255, 255)',
      TOTAL: { start: 0, end: 0 },
      MONTHLY: { start: 0, end: 0 },
      WEEKLY: { start: 0, end: 0 },
      ALL: { start: 0, end: 0 },
      MONTH: { start: 0, end: 0 },
      YEAR: { start: 0, end: 0 },
      QUARTER: { start: 0, end: 0 },
    },{
      label: '11%-20%',
      color: 'rgb(190, 251, 255)', // '#BEFBFF', //
      TOTAL: { start: 0, end: 0 },
      MONTHLY: { start: 0, end: 0 },
      WEEKLY: { start: 0, end: 0 },
      ALL: { start: 0, end: 0 },
      MONTH: { start: 0, end: 0 },
      YEAR: { start: 0, end: 0 },
      QUARTER: { start: 0, end: 0 },
    },{
      label: '21%-30%',
      color: 'rgb(84, 245, 255)', // '#54F5FF', //
      TOTAL: { start: 0, end: 0 },
      MONTHLY: { start: 0, end: 0 },
      WEEKLY: { start: 0, end: 0 },
      ALL: { start: 0, end: 0 },
      MONTH: { start: 0, end: 0 },
      YEAR: { start: 0, end: 0 },
      QUARTER: { start: 0, end: 0 },
    },{
      label: '31%-40%',
      color: 'rgb(11, 206, 219)',// '#0BCEDB', //
      TOTAL: { start: 0, end: 0 },
      MONTHLY: { start: 0, end: 0 },
      WEEKLY: { start: 0, end: 0 },
      ALL: { start: 0, end: 0 },
      MONTH: { start: 0, end: 0 },
      YEAR: { start: 0, end: 0 },
      QUARTER: { start: 0, end: 0 },
    },{
      label: '41%-50%',
      color: 'rgb(15, 139, 156)',// '#0F8B9C', //
      TOTAL: { start: 0, end: 0 },
      MONTHLY: { start: 0, end: 0 },
      WEEKLY: { start: 0, end: 0 },
      ALL: { start: 0, end: 0 },
      MONTH: { start: 0, end: 0 },
      YEAR: { start: 0, end: 0 },
      QUARTER: { start: 0, end: 0 },
    },{
      label: '51%-65%',
      color: 'rgb(5, 97, 109)',// '#05616D', //
      TOTAL: { start: 0, end: 0 },
      MONTHLY: { start: 0, end: 0 },
      WEEKLY: { start: 0, end: 0 },
      ALL: { start: 0, end: 0 },
      MONTH: { start: 0, end: 0 },
      YEAR: { start: 0, end: 0 },
      QUARTER: { start: 0, end: 0 },
    },{
      label: '66%-80%',
      color: 'rgb(0, 64, 73)', // '#004049', //
      TOTAL: { start: 0, end: 0 },
      MONTHLY: { start: 0, end: 0 },
      WEEKLY: { start: 0, end: 0 },
      ALL: { start: 0, end: 0 },
      MONTH: { start: 0, end: 0 },
      YEAR: { start: 0, end: 0 },
      QUARTER: { start: 0, end: 0 },
    },{
      label: '81%-100%',
      color: 'rgb(0, 47, 50)', // '#002F32', //
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
  const [detail, setDeatil] = React.useState();
  const a = window.localStorage.getItem('staticType')
 
  const staticType = React.useRef(a);
  if(!a){
    window.localStorage.setItem('staticType','ALL')
    staticType.current='ALL'
  }
  const [staticList, setStaticList] = React.useState(options[mapType.current]);
const [zoomLevel, setZoomLevel] = React.useState(initZoom);
const [minZoomLevel, setMinZoomLevel] = React.useState(zoomLimit[0]);
  const [maxZoomLevel, setMaxZoomLevel] = React.useState(zoomLimit[1]);
  const [fullScreen, setFullScreen] = React.useState(false);
  const [isParcelDetailVisible, setIsParcelDetailVisible] = React.useState(true);
  const [activeColor, setActiveColor] = React.useState(null);
  const [clickPosition, setClickPosition] =  React.useState({ x: 0, y: 0 });
  const [clickedColor, setClickedColor] =  React.useState(null);
  const mapWidth = 1200; // 假设地图内容的宽度为 1000
const mapHeight = 1000; // 假设地图内容的高度为 800

const scaleX = 1000 / mapWidth;
const scaleY = 800 / mapHeight;
const minScale = Math.min(scaleX, scaleY);
const maxScale = 2.8; // 设置最大比例为2

const [scaleA, setScaleA] = React.useState(minScale);
const [nameCont, setNameCont] = React.useState(null);
const [zoomCount, setZoomCount] =  React.useState(0);

const getSingleColor = React.useCallback(
  (fe) => {
    let color = defalutColor;
    let count = fe.attr[staticType.current.toLocaleLowerCase()];
    let index = -1;
    if (!Number.isNaN(count) && legends.current) {
      count = count < 0 ? 0 : count;
      index = legends.current.findIndex((x) => {
        return count <= x[staticType.current].start && count >= x[staticType.current].end;
      });
      if (index > -1) {
        const allColor = legends.current[index];
        /* eslint no-underscore-dangle: 0 */
        fe.attr.colorIndex = index; // eslint-disable-line
        color = allColor.color;
      }
    }
    return {
      color,
      index,
    };
  },
  [null],
);

// const onActive = React.useCallback(
//   async (event) => {
//     if (!clickToJump && activeParcel.current.id) {
//       clearHeightLight();
//       const res = await getTzLandParcelDetail(activeParcel.current.id);
//       const { data } = res;
//       setShowDetail(true);
//       setDeatil(convert(data));
//       if (!activeParcel.current.point) {
//         return;
//       }
//       (popDetail.current as any).style.display = 'block';
//       const vector = activeParcel.current.point;
//       detailPosition.current.x = vector.x;
//       detailPosition.current.y = vector.y;
//       detailPosition.current.z = vector.z;
//       detailPosition.current.parcel = activeParcel.current.parcel;
//       setColor(activeParcel.current.parcel, new Color(0xff0000));
//       const { index } = getSingleColor(activeParcel.current.parcel.userData);
//       if (index > -1) {
//         setActiveColor(index);
//       }
//     }
//   },
//   [clearHeightLight, setColor],
// );


const requestPriceMapOneData = React.useCallback(()=>{
  // console.log(staticType.current);
  
  const svg = d3.select(svgRef.current)
  const gMap = svg.append('g').attr('id', 'gMap');
  const res = getNetVrkMap();
  
  res.then((resDA)=>{
  d3.csv('https://nft.netvrk.co/data/data.csv').then((data) => {
    // // 创建地理投影
    const projection = d3.geoMercator();
    
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
const coordinatesNum = resDA.data.parcels.map((parcel) => {
// 使用数组解构获取 coordinates 数组中的第一个值和第二个值
const [coordinatesX, coordinatesY] = parcel.geometry.coordinates;

return[coordinatesX, coordinatesY]
});

const priceNum = resDA.data.parcels.map(item => {
  const { month, quarter, year, all } = item.price;
  return { month, quarter, year, all };
});


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


const matrixNum = resDA.data.parcels.map((parcel) => {
  // 使用数组解构获取 coordinates 数组中的第一个值和第二个值
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
 

 // 定义拖动事件的初始坐标
 let lastTranslation = [0, 0];
 let offset = [0, 0];
 let clickTooltip;
 
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
      .attr('fill', (d, i) => matchedColors[i])
      .attr('stroke', 'white')
      .attr('stroke-width', 1)
      svg.call(dragBehavior).select('g').attr('transform', 'translate(-2151, -2190)');

      const containerElement = document.getElementById('container'); 
      let [xaa, yaa] = [0, 0]; // 初始化鼠标位置
      
      let tooltip = null; // 存储文本框元素的引用
  //     d3.select('.price-legend') // 使用选择器选择具有指定id的图例元素
  // .selectAll('.legend_labelLi__5tElZ') // 选择图例元素中的选项（如果有类名为.legend-option的元素）
  // .style('fill', 'red') // 将选项的颜色修改为红色
  // .on('click', handleLegendItemClick);

  // 定义点击事件处理程序
  // console.log(d3.select('.legend_legend__enz1F').selectAll('.legend_labelLi__5tElZ'));


function handleLegendItemClick(eventX, d) {
setActiveColor(null)

/// 获取图例列表元素
const legendItems = document.querySelectorAll('.legend_labelLi__5tElZ');
const clickedColors = d3.select(this).style('fill');// 使用正确的语法获取点击的颜色
// console.log(clickedColors, 'clickedColors');

setClickedColor(clickedColors);
let colorChanged = false; // 标志变量，表示是否已经变更了颜色

const legendItemsArray = Array.from(legendItems); // 转换为数组

legendItemsArray.some(item => {
  // if(clickedColor){
  //     item.setAttribute('style', 'color: ');
  // }
  
  if (item.getAttribute('data-color') === clickedColor) {
    // item.setAttribute('style', 'color: red');
    colorChanged = true;
    return true;
  }
  return false; // 未找到匹配项时继续迭代
});

  Object.keys(colors).forEach((key) => {
    // console.log(colors);
    
    const colorData = colors[key];
  //  console.log(clickedColors);
   
    colorData.forEach((dataD, index) => {
      if (dataD.color === clickedColors) {
        const originalColor = dataD.color; // 保存原始的颜色
        colorData[index].color = 'red'; // 将颜色改为红色
        setTimeout(() => {
          colorData[index].color = originalColor; // 恢复为之前的颜色
          // 其他恢复操作...
        }, 1000);
      }
    });
  });



  const { clientX, clientY } = eventX;
  // 更新点击位置的坐标
  setClickPosition({ x: clientX, y: clientY });
  const resDetail = getNetvrkDetail(d.properties.token_id);
  resDetail.then((resDetailData)=>{
setDeatil(resDetailData.data)
setIsParcelDetailVisible(true)
  })
  
}

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
        .on('click', handleLegendItemClick)
  //       .on('click', function (event, d) {
  //         event.stopPropagation(); // 阻止点击事件冒泡到父元素
  //      // 创建一个新的框用于显示name
  //      if(clickTooltip){
  //       clickTooltip.remove();
  //       clickTooltip = null; // 重置 clickTooltip 变量
  //       d3.select('.tooltip').remove();
  //     }
    
  //         clickTooltip = svg.append('g')
  //           .attr('class', 'click-tooltip')
  //           .style('pointer-events', 'none');

  //           const resDetail = getNetvrkDetail(d.properties.token_id);

            
  //         clickTooltip.append('rect')
  //           .attr('width', 180)
  //           .attr('height', 30)
  //           .attr('fill', 'transparent') // 设置背景色为透明
  //           .attr('stroke', 'white') // 设置边框颜色为白色
  //           .attr('stroke-width', 1) // 设置边框线宽度为1
  //           .attr('rx', '6') // 设置圆角半径为6px（根据宽度的20%）
  //           .attr('ry', '6')
  //           .attr('text-anchor', 'middle'); // 设置文本在矩形框内居中
      
  //         clickTooltip.append('text')
  //           .attr('x', 90) // 将文本的 x 坐标设置为矩形的一半，使其居中
  //           .attr('y', 20)
  //           .text(d.properties.name)
  //           .style('font-family', 'Arial') // 修改为所需的字体
  //           .style('fill', 'red') // 修改为所需的颜色
  //           .style('font-size', '20px') // 修改为所需的字体大小
  //           .style('text-anchor', 'middle'); // 设置文本在矩形框内居中
      
  //         clickTooltip.attr('transform', `translate(${xaa - 380},${yaa + 200})`);
  //         d3.select('.price-legend')
  //         .selectAll('.labelLi')
  //         .style('fill', 'red');
  //         // 点击地块之外的区域时移除框
  //          // 获取点击的地块的数据或标识符，以便确定要变红的图例条目
  // const clickedData = d; // 获取点击地块的数据或标识符，根据需要进行调整
  // console.log(clickedData,'clickedDataclickedDataclickedData');
  
  // // 获取当前图例框的所有图例条目
  // const legendItems = d3.selectAll('.legend_legend__enz1F .legend_labelLi__5tElZ');
  // console.log(legendItems,'ssaaaaaaa');
  
  // // 遍历图例条目，并根据点击的地块数据与图例数据进行匹配
  // // legendItems.each(function (legendItemData) {
  // //   const legendItem = d3.select(this);
  // //   console.log(legendItemData,'legendItemDatalegendItemDatalegendItemData');
    
  // //   // 根据需要调整判断条件，匹配应该根据数据属性进行比较
  // //   if (legendItemData === clickedData) {
  // //     legendItem.style('fill', 'red'); // 将匹配的图例条目颜色设置为红色
  // //   } else {
  // //     // 如果不匹配，将图例条目颜色重置为原始颜色（假设原始颜色存储在属性中）
  // //     const originalColor = legendItem.attr('data-original-color');
  // //     legendItem.style('fill', originalColor);
  // //   }
  // // });
  // legendItems.each(function () {
  //   const legendItem = d3.select(this);
  
  //   // 获取图例条目的数据或标识符，根据需要进行调整
  //   const legendItemData = legendItem.attr('.new_legend_label');
  //   console.log(legendItemData, 'legendItemData');
  
  //   // 根据需要调整判断条件，匹配应该根据数据属性进行比较
  //   if (legendItemData === clickedData) {
  //     legendItem.style('fill', 'red'); // 将匹配的图例条目颜色设置为红色
  //   } else {
  //     // 如果不匹配，将图例条目颜色重置为原始颜色（假设原始颜色存储在属性中）
  //     const originalColor = legendItem.attr('.new_legend_label');
  //     legendItem.style('fill', originalColor);
  //   }
  // });
  //         d3.select('body')
  //         .on('click', function () {
  //           if (clickTooltip) {
  //             clickTooltip.remove();
  //             clickTooltip = null; // Reset the clickTooltip variable
  //           }
  //         });

  //       })
        
        .on('mouseout', function () {
          d3.select('.tooltip').remove();
      })
      
      containerElement.addEventListener('mousemove', (eventX) => {
        const { clientX, clientY } = eventX;
        const containerRect = containerElement.getBoundingClientRect();
        xaa = clientX - containerRect.left;
        yaa = clientY - containerRect.top;
      });
    })  

  });
}, [staticType.current]);



React.useEffect(() => {
  
    requestPriceMapOneData()
  }, [staticType.current]);

    

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


  const changeStaticType = React.useCallback((value)=>{
    // console.log(5555555555);
    staticType.current =value;
window.localStorage.setItem('staticType',staticType.current)
window.location.reload()
    // console.log(staticType.current,'有没有变化');
    requestPriceMapOneData()
  },[staticType.current]
  );

  const closePop = () => {
    setIsParcelDetailVisible(false);
  };


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
  >
  <svg   
  preserveAspectRatio="xMidYMid meet" 
  ref={svgRef}  
  style={{ width: '100%', height: '100%', position:'relative',transform: `scale(${scaleA})` }} 
  viewBox={`0 0 ${mapWidth} ${mapHeight}`}
   width="100%" height="100%"
   >
  </svg>
</div>
<div className={cn('',style.drtail)}  
style={{
      position: 'absolute',
      top: clickPosition.y-300,
      left: clickPosition.x,
    }}>
{isParcelDetailVisible===true?<ParcelDeatil
          options={detail}
          trafficType={staticType.current}
          mapType={mapType.current}
          close={closePop}
          isSomnium={false}
          isOtherSide={true}
          
        ></ParcelDeatil>:null}</div>
   <Legend
      className={`${style.legend} price-legend`}
        title={ 'Price ranking'}
        options={legends.current}
        active={activeColor}
        styles={{
          fill: activeColor === clickedColor ? 'red' : 'transparent',
        }}
      ></Legend>
  </>
  )
  ;
};

export default Map;
