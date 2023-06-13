import React from 'react';
import * as d3 from 'd3';
import cn from 'classnames';
import { FeatureCollection } from 'geojson';
import style from './index.module.css';

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
const [zoomLevel, setZoomLevel] = React.useState(initZoom);
const [showPopup, setShowPopup] = React.useState(false);
const [minZoomLevel, setMinZoomLevel] = React.useState(zoomLimit[0]);
  const [maxZoomLevel, setMaxZoomLevel] = React.useState(zoomLimit[1]);
  const [fullScreen, setFullScreen] = React.useState(false);
  const [mouseX, setMouseX] = React.useState(-1);
  const [mouseY, setMouseY] = React.useState(-1);
  const [positionX, setPositionX] = React.useState(0);
  const [versionNumber, setVersionNumber] = React.useState(0);
  const [positionY, setPositionY] = React.useState(0);
console.log(initZoom,666666,minZoomLevel,6666666,maxZoomLevel);
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
const requestPriceMapOneData = ()=>{
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
          return name;
        })
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


    const dragBehavior = d3.drag().on('drag', (event) => {
      const [x, y] = d3.pointer(event);
      // const [x, y] = [event.pageX, event.pageY];
      console.log(x, y);
      svg.select('#gMap').attr('transform', `translate(${x},${y})`);
      console.log(22222222222, svg.attr('transform', `translate(${x},${y})`));
      
      // svg.attr('transform', d3.event.transform);
      
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
      .attr('fill', 'red')
      .attr('stroke', 'white')
      .attr('stroke-width', 1)
      svg.call(dragBehavior)
      // gMap.call(zoomScale);
       // 应用缩放对象
//     svg.call(onMapChange);
console.log(d3,3333333333333333);

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
    svg
      .selectAll('rect')
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


React.useEffect(() => {
  console.log(svgRef.current.innerHTML);

  function handleMouseMove(event: MouseEvent) {
    if (showPopup && mouseX === -1 && mouseY === -1) {
      setMouseX(event.offsetX);
      setMouseY(event.offsetY);
      setPositionX(event.offsetX);
      setPositionY(event.offsetY);
    }
  }

  if (withPopup) {
    document.addEventListener('mousemove', handleMouseMove);
  }

  return () => {
    if (withPopup) {
      document.removeEventListener('mousemove', handleMouseMove);
    }
  };
}, [withPopup, showPopup, mouseX, mouseY]);

const closePop = React.useCallback(() => {
  // setShowDetail(false);
  // setSelectTile(null);
  // setActiveColor(null);
}, [null]);



React.useEffect(() => {
    requestPriceMapOneData()
  }, []);

  const zoomButtonClick = React.useCallback(
    (type) => {
      console.log('aaa',type);
      
      if (type === 'zoomIn') {
        setZoomLevel(zoomLevel > maxZoomLevel ? maxZoomLevel : zoomLevel + 1);
      } else {
        setZoomLevel(zoomLevel < minZoomLevel ? minZoomLevel : zoomLevel - 1);
      }
    },
    [zoomLevel, maxZoomLevel, minZoomLevel],
  );

  const full = React.useCallback(async () => {
    const isFull = !fullScreen;
    const s = await fullScreenOnClick(isFull);
    setFullScreen(isFull);
  }, [fullScreen, fullScreenOnClick]);

  const width = 1800;
  const height = 1600;

  const handleDraging = React.useCallback(
    (event) => {
      console.log(6666666666666666);
      
      if (lastDragX.current === -1 && lastDragY.current === -1) {
        return;
      }
      const newX = event.layerX;
      const newY = event.layerY;

      const dX = newX - lastDragX.current;
      const dY = newY - lastDragY.current;

      lastDragX.current = newX;
      lastDragY.current = newY;

      detailX.current = detailX.current + dX;
      detailY.current = detailY.current + dY;
    },
    [lastDragX, lastDragY],
  );
  const handleDragEnd = React.useCallback(
    (event) => {
      console.log(555555555);
      
      event.preventDefault();
      mousedownTimestamp.current = Date.now() - mousedownTimestamp.current;
      if (mousedownTimestamp.current < 200) {
        console.log(66666666666);
        detailX.current = event.layerX;
        detailY.current = event.layerY;
      }
      setVersionNumber(0);
      document.removeEventListener('mousemove', handleDraging);
      lastDragX.current = -1;
      lastDragY.current = -1;
    },
    [handleDraging],
  );

  const handleDrag = React.useCallback(
    (event) => {
  console.log(333333333333);
  
      mousedownTimestamp.current = Date.now();
      setVersionNumber(1);
      // if (showDetail) {
        lastDragX.current = event.nativeEvent.layerX;
        lastDragY.current = event.nativeEvent.layerY;
      // }

      document.addEventListener('mousemove', handleDraging);
      document.addEventListener('mouseup', handleDragEnd);
    },
    [handleDraging, handleDragEnd],
  );

  return (
    <>
    {zoomControl ? (
      <>
        <div className={cn('flex flex-col', style.zoom)}>
          <div
            className={cn('flex justify-center items-center', style.zoomButton)}
            onClick={() => {
              zoomButtonClick('zoomIn');
            }}
          >
            <img
              className={zoomLevel >= maxZoomLevel ? style.disable : null}
              src="./images/Union.png"
            ></img>
          </div>
          <div
            className={cn('flex justify-center items-center', style.zoomButtonrEACT)}
            onClick={() => {
              zoomButtonClick('zoomOut');
            }}
          >
            <img
              className={zoomLevel <= minZoomLevel ? style.disable : null}
              src="./images/Rectangle.png"
            ></img>
          </div>
        </div>
        <div
          className={cn('text-white absolute flex justify-center items-center', style.fullBtn)}
          onClick={full}
        >
          <img src={`./images/${fullScreen ? 'unfull.png' : 'full.png'}`}></img>
        </div>
      </>
    ) : null}
       <div
       id="gMap"
        className={style.map}
        style={{ backgroundColor: backColor }}
        // onClick={clickToJump ? jumpToMap : null}
        onMouseDown={dragging ? handleDrag : null}
      >
  <svg ref={svgRef} width={width} height={height}>
  <g id="gMaps"></g>
  </svg>
  </div>
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
