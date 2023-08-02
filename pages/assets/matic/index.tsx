import React from 'react'
import HomePage from "../../../components/home-page";
import Page from "../../../components/page";
import { SITE_NAME, META_DESCRIPTION } from "../../../common/const";
import cn from "classnames";
import style from "./index.module.css";

export default function index() {
  const meta = {
    title: ` ${SITE_NAME}`,
    description: META_DESCRIPTION,
  };
  
  return (
    <Page meta={meta} className={cn("", style.page)}>
        <HomePage/>
        <div>22211</div>
        </Page>
  )
}
