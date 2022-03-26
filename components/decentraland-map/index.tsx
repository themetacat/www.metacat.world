import React from 'react';
import cn from 'classnames';

import ReactTooltip from 'react-tooltip';
import { TileMap } from 'react-tile-map';
import style from './index.module.css';

import Selecter from '../select';
import Legend from '../legend';
import DecentralandDeatil from '../decentraland-detail';

import { convert } from '../../common/utils';
import Popup from '../decentraland-popup';

import { getDecentralandMapLevelThreeData, getDclParcelDetail } from '../../service';

// this type is same as https://github.com/decentraland/atlas-server v2 version. There is only 5 types has color
const COLOR_BY_TYPE = Object.freeze({
  0: '#ff9990', // my parcels
  1: '#ff4053', // my parcels on sale
  2: '#ff9990', // my estates
  3: '#ff4053', // my estates on sale
  4: '#ffbd33', // parcels/estates where I have permissions
  district: '#5054D4', // districts
  6: '#563db8', // contributions
  road: '#716C7A', // roads
  plaza: '#70AC76', // plazas
  owned: '#3D3A46', // owned parcel/estate
  10: '#3D3A46', // parcels on sale (we show them as owned parcels)
  unowned: '#09080A', // unowned pacel/estate
  12: '#18141a', // background
  13: '#110e13', // loading odd
  14: '#0d0b0e', // loading even
});

const mapT = [{ value: 'price', label: 'PRICE' }];

const options = {
  price: [
    { label: 'MONTHLY', value: 'month' },
    { label: 'QUARTERLY', value: 'quarter' },
    { label: 'YEARLY', value: 'year' },
    { label: 'All-Time', value: 'all' },
  ],
};

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
  canClick?: boolean;
}

export type AtlasTile = {
  x: number;
  y: number;
  type: number;
  left?: number;
  top?: number;
  topLeft?: number;
  owner: string;
  name?: string;
  estate_id?: string;
  color?: string;
  land_id?: string;
};

export type AtlasState = {
  tiles?: Record<string, AtlasTile>;
};

const colors = {
  0: [
    {
      label: 'Top 20%',
      color: '#00F0FF',
      TOTAL: { start: 0, end: 0 },
      MONTHLY: { start: 0, end: 0 },
      WEEKLY: { start: 0, end: 0 },
      ALL: { start: 0, end: 0 },
      MONTH: { start: 0, end: 0 },
      YEAR: { start: 0, end: 0 },
      QUARTER: { start: 0, end: 0 },
    },
    {
      label: '21%-50%',
      color: '#119CAE',
      TOTAL: { start: 0, end: 0 },
      MONTHLY: { start: 0, end: 0 },
      WEEKLY: { start: 0, end: 0 },
      ALL: { start: 0, end: 0 },
      MONTH: { start: 0, end: 0 },
      YEAR: { start: 0, end: 0 },
      QUARTER: { start: 0, end: 0 },
    },
    {
      label: '51%-80%',
      color: '#03464F',
      TOTAL: { start: 0, end: 0 },
      MONTHLY: { start: 0, end: 0 },
      WEEKLY: { start: 0, end: 0 },
      ALL: { start: 0, end: 0 },
      MONTH: { start: 0, end: 0 },
      YEAR: { start: 0, end: 0 },
      QUARTER: { start: 0, end: 0 },
    },
    {
      label: '81%-100%',
      color: '#0A2227',
      TOTAL: { start: 0, end: 0 },
      MONTHLY: { start: 0, end: 0 },
      WEEKLY: { start: 0, end: 0 },
      ALL: { start: 0, end: 0 },
      MONTH: { start: 0, end: 0 },
      YEAR: { start: 0, end: 0 },
      QUARTER: { start: 0, end: 0 },
    },
  ],
  1: [
    {
      label: 'Top 15%',
      color: '#4FFFF4',
      TOTAL: { start: 0, end: 0 },
      MONTHLY: { start: 0, end: 0 },
      WEEKLY: { start: 0, end: 0 },
      ALL: { start: 0, end: 0 },
      MONTH: { start: 0, end: 0 },
      YEAR: { start: 0, end: 0 },
      QUARTER: { start: 0, end: 0 },
    },
    {
      label: '16%-30%',
      color: '#00D0DD',
      TOTAL: { start: 0, end: 0 },
      MONTHLY: { start: 0, end: 0 },
      WEEKLY: { start: 0, end: 0 },
      ALL: { start: 0, end: 0 },
      MONTH: { start: 0, end: 0 },
      YEAR: { start: 0, end: 0 },
      QUARTER: { start: 0, end: 0 },
    },
    {
      label: '31%-45%',
      color: '#007B8C',
      TOTAL: { start: 0, end: 0 },
      MONTHLY: { start: 0, end: 0 },
      WEEKLY: { start: 0, end: 0 },
      ALL: { start: 0, end: 0 },
      MONTH: { start: 0, end: 0 },
      YEAR: { start: 0, end: 0 },
      QUARTER: { start: 0, end: 0 },
    },
    {
      label: '46%-60%',
      color: '#00404E',
      TOTAL: { start: 0, end: 0 },
      MONTHLY: { start: 0, end: 0 },
      WEEKLY: { start: 0, end: 0 },
      ALL: { start: 0, end: 0 },
      MONTH: { start: 0, end: 0 },
      YEAR: { start: 0, end: 0 },
      QUARTER: { start: 0, end: 0 },
    },
    {
      label: '61%-75%',
      color: '#00232B',
      TOTAL: { start: 0, end: 0 },
      MONTHLY: { start: 0, end: 0 },
      WEEKLY: { start: 0, end: 0 },
      ALL: { start: 0, end: 0 },
      MONTH: { start: 0, end: 0 },
      YEAR: { start: 0, end: 0 },
      QUARTER: { start: 0, end: 0 },
    },
    {
      label: '76%-100%',
      color: '#00191E',
      TOTAL: { start: 0, end: 0 },
      MONTHLY: { start: 0, end: 0 },
      WEEKLY: { start: 0, end: 0 },
      ALL: { start: 0, end: 0 },
      MONTH: { start: 0, end: 0 },
      YEAR: { start: 0, end: 0 },
      QUARTER: { start: 0, end: 0 },
    },
  ],
  2: [
    {
      label: 'Top 10%',
      color: '#72FFE6',
      all: { start: 0, end: 0 },
      month: { start: 0, end: 0 },
      year: { start: 0, end: 0 },
      quarter: { start: 0, end: 0 },
    },
    {
      label: '11%-20%',
      color: '#00E1EF',
      all: { start: 0, end: 0 },
      month: { start: 0, end: 0 },
      year: { start: 0, end: 0 },
      quarter: { start: 0, end: 0 },
    },
    {
      label: '21%-30%',
      color: '#009DA7',
      all: { start: 0, end: 0 },
      month: { start: 0, end: 0 },
      year: { start: 0, end: 0 },
      quarter: { start: 0, end: 0 },
    },
    {
      label: '31%-40%',
      color: '#006A78',
      all: { start: 0, end: 0 },
      month: { start: 0, end: 0 },
      year: { start: 0, end: 0 },
      quarter: { start: 0, end: 0 },
    },
    {
      label: '41%-50%',
      color: '#004149',
      all: { start: 0, end: 0 },
      month: { start: 0, end: 0 },
      year: { start: 0, end: 0 },
      quarter: { start: 0, end: 0 },
    },
    {
      label: '51%-65%',
      color: '#082C31',
      all: { start: 0, end: 0 },
      month: { start: 0, end: 0 },
      year: { start: 0, end: 0 },
      quarter: { start: 0, end: 0 },
    },
    {
      label: '66%-80%',
      color: '#001F23',
      all: { start: 0, end: 0 },
      month: { start: 0, end: 0 },
      year: { start: 0, end: 0 },
      quarter: { start: 0, end: 0 },
    },
    {
      label: '81%-100%',
      color: '#001B21',
      all: { start: 0, end: 0 },
      month: { start: 0, end: 0 },
      year: { start: 0, end: 0 },
      quarter: { start: 0, end: 0 },
    },
  ],
};

const NOT_CUSTOME_COLOR = {
  road: '#15282C',
  plaza: '#011406',
  district: '#021B16',
};

function DecentralandMap({
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
  canClick = true,
}: Props) {
  const [minZoomLevel, setMinZoomLevel] = React.useState(zoomLimit[0]);
  const [maxZoomLevel, setMaxZoomLevel] = React.useState(zoomLimit[1]);
  const [fullScreen, setFullScreen] = React.useState(false);
  const [zoomLevel, setZoomLevel] = React.useState(initZoom);
  const [detail, setDeatil] = React.useState();
  const [showPopup, setShowPopup] = React.useState(false);
  const [hoveredTile, setHoveredTile] = React.useState(null);
  const [mouseX, setMouseX] = React.useState(-1);
  const [mouseY, setMouseY] = React.useState(-1);
  const [positionX, setPositionX] = React.useState(0);
  const [positionY, setPositionY] = React.useState(0);
  const [showDetail, setShowDetail] = React.useState(false);
  const mapType = React.useRef('price');
  const staticType = React.useRef('all');
  const [staticList, setStaticList] = React.useState(options[mapType.current]);
  const legends = React.useRef(colors[2]);
  const [mapTiles, setMapTiles] = React.useState(null);
  const orginData = React.useRef(null);
  const mousedownTimestamp = React.useRef(0);
  const lastDragX = React.useRef(-1);
  const lastDragY = React.useRef(-1);
  const detailY = React.useRef(0);
  const detailX = React.useRef(0);
  // const clickToJumpRef = React.useRef(clickToJump);

  const dealWithParcel = React.useCallback(
    (data, colorsLimit) => {
      const tiles = {};

      for (let i = 0; i < data.length; i += 1) {
        let color = NOT_CUSTOME_COLOR[data[i].properties.type];
        if (!NOT_CUSTOME_COLOR[data[i].properties.type]) {
          let count = data[i][mapType.current][staticType.current];
          count = count < 0 ? 0 : count;
          const allColor = colorsLimit.find((co) => {
            return count <= co[staticType.current].start && count >= co[staticType.current].end;
          });

          if (allColor) {
            color = allColor.color;
          }
        }

        const name = data[i].properties.id;
        const coord = data[i].properties.id.split(',');
        tiles[name] = {
          ...data[i].properties,
          x: coord[0],
          y: coord[1],
          color,
        };
      }
      setMapTiles(tiles as Record<string, AtlasTile>);
    },
    [null],
  );

  const requestLand = React.useCallback(async () => {
    //
    const res = await getDecentralandMapLevelThreeData();
    const { code, data } = res;
    if (code === 100000 && data) {
      const { stats, parcels } = convert(data);
      const limit = stats[mapType.current].levelOne;
      colors[2].forEach((co, index) => {
        Object.assign(co.all, limit[index].all);
        Object.assign(co.month, limit[index].month);
        Object.assign(co.quarter, limit[index].quarter);
        Object.assign(co.year, limit[index].year);
      });
      orginData.current = parcels;
      dealWithParcel(parcels, colors[2]);
    }
  }, [dealWithParcel, colors]);

  const closePop = React.useCallback(() => {
    setShowDetail(false);
  }, [null]);

  const changeStaticType = React.useCallback(
    (newType) => {
      staticType.current = newType;
      closePop();
      if (orginData.current) {
        dealWithParcel(orginData.current, colors[2]);
      }
    },
    [dealWithParcel, colors],
  );

  const changeMapType = React.useCallback(
    (newType) => {
      mapType.current = newType;
      setStaticList(options[newType]);
      staticType.current = options[newType][1].value;
      closePop();
    },
    [minZoomLevel],
  );

  const zoomButtonClick = React.useCallback(
    (type) => {
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

  const Layer = React.useCallback(
    (x, y) => {
      const id = `${x},${y}`;
      if (mapTiles && id in mapTiles) {
        const tile = mapTiles[id];
        return {
          color: tile.color ? tile.color : COLOR_BY_TYPE[tile.type],
          top: !!tile.top,
          left: !!tile.left,
          topLeft: !!tile.topLeft,
        };
      }
      return {
        color: (x + y) % 2 === 0 ? COLOR_BY_TYPE[13] : COLOR_BY_TYPE[14],
      };
    },
    [mapTiles],
  );

  const onMapChange = React.useCallback(
    ({ zoom: z, nw, se, center }) => {
      if (z !== zoomLevel) {
        setZoomLevel(z);
      }
    },
    [zoomLevel],
  );

  const handleHover = React.useCallback(
    (x: number, y: number) => {
      if (!withPopup || !mapTiles) return;
      const id = `${x},${y}`;
      const tile = mapTiles[id];
      if (tile && !showPopup) {
        setShowPopup(true);
        setHoveredTile(tile);
        setMouseX(-1);
        setMouseY(-1);
      } else if (tile && tile !== hoveredTile) {
        setHoveredTile(tile);
        setMouseX(-1);
        setMouseY(-1);
      } else if (!tile && showPopup) {
        setShowPopup(false);
      }
    },
    [hoveredTile, showPopup, withPopup, mapTiles],
  );

  const requestDetail = React.useCallback(
    async (id: string) => {
      const d = await getDclParcelDetail(id);
      const { data } = d;
      setShowDetail(true);
      setDeatil(convert(data));
    },
    [convert],
  );

  const handleClick = React.useCallback(
    (x: number, y: number) => {
      if (!mapTiles) return;
      const id = `${x},${y}`;
      const tile = mapTiles[id];
      if (tile && tile.type === 'owned') {
        requestDetail(tile.landId);
        return;
      }
      setShowDetail(false);
    },
    [mapTiles, requestDetail],
  );

  const handleHidePopup = React.useCallback(() => {
    setShowPopup(false);
    setMouseX(-1);
    setMouseY(-1);
  }, [null]);

  const handleDraging = React.useCallback(
    (event) => {
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
      event.preventDefault();
      mousedownTimestamp.current = Date.now() - mousedownTimestamp.current;
      if (mousedownTimestamp.current < 200) {
        detailX.current = event.layerX;
        detailY.current = event.layerY;
      }
      document.removeEventListener('mousemove', handleDraging);
      lastDragX.current = -1;
      lastDragY.current = -1;
    },
    [handleDraging],
  );

  const handleDrag = React.useCallback(
    (event) => {
      mousedownTimestamp.current = Date.now();
      if (showDetail) {
        lastDragX.current = event.nativeEvent.layerX;
        lastDragY.current = event.nativeEvent.layerY;
      }

      document.addEventListener('mousemove', handleDraging);
      document.addEventListener('mouseup', handleDragEnd);
    },
    [showDetail, handleDraging, handleDragEnd],
  );

  React.useEffect(() => {
    requestLand();
  }, [null]);

  // mouse move

  React.useEffect(() => {
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

  return (
    <div className={style.mapContainer} onClick={onClick} onMouseLeave={handleHidePopup}>
      <div className={cn('flex justify-between items-center', style.picker)}>
        {/* <div className={cn('flex justify-center items-center', style.type)}>TRAFFIC</div> */}
        <Selecter
          options={mapT}
          onClick={changeMapType}
          showArrow={changeTypeControl}
          defaultLabel={mapType.current}
        ></Selecter>
        <div className={style.dividing}></div>
        <Selecter
          options={staticList}
          onClick={changeStaticType}
          showArrow={true}
          defaultLabel={staticType.current}
        ></Selecter>
      </div>
      {mapType.current === 'price' ? (
        <div className={cn('flex justify-center items-center', style.helper)}>
          <div
            data-tip
            data-for="info"
            data-place="bottom"
            className={cn('relative flex justify-center items-center', style.helperInfo)}
          >
            <img src="/images/helper.png"></img>
          </div>
          <ReactTooltip
            id="info"
            effect="solid"
            textColor="#AAAAAA"
            // className={style.pop}
            backgroundColor="#0F191B"
            border={false}
          >
            <div className={style.info}>
              The brighter the area, the higher the average price in the selected time frame.The
              first/second level show the average parcel sale USD in island/suburb, the third level
              (and above) show the cumulative sale USD of the parcel.
            </div>
          </ReactTooltip>
        </div>
      ) : (
        <></>
      )}
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
              className={cn('flex justify-center items-center', style.zoomButton)}
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

      <div className={style.map} style={{ backgroundColor: backColor }} onMouseDown={handleDrag}>
        <TileMap
          layers={[Layer]}
          zoom={zoomLevel}
          minSize={2}
          size={2}
          onChange={onMapChange}
          onHover={handleHover}
          onClick={handleClick}
        ></TileMap>
        {hoveredTile ? (
          <Popup
            x={positionX}
            y={positionY}
            tile={hoveredTile}
            visible={showPopup}
            position={positionX > window.innerWidth - 280 ? 'left' : 'right'}
          ></Popup>
        ) : null}
        {showDetail ? (
          <DecentralandDeatil
            showRef={showDetail}
            className={cn('absolute')}
            x={detailX.current}
            y={detailY.current}
            options={detail}
            trafficType={staticType.current}
            mapType={mapType.current}
            close={closePop}
          ></DecentralandDeatil>
        ) : null}
      </div>
      <Legend
        className={style.legend}
        title={mapType.current === 'TRAFFIC' ? 'Traffic ranking' : 'Price ranking'}
        options={legends.current}
      ></Legend>
    </div>
  );
}

export default DecentralandMap;
