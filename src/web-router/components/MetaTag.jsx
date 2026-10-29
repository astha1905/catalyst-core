import React, { useContext, useState, useEffect, useLayoutEffect } from "react"
import { OneMgRouterContext } from "../context.jsx"
import { useRouterData } from "./RouterDataProvider.jsx"
import { getMetaData } from "../utils/metaDataUtils.jsx"
import { useLocation } from "react-router"

const DocumentTitle = ({ value }) => {
    useLayoutEffect(() => {
        document.title = value

        const [, ...duplicateTitleElements] = Array.from(document.head.getElementsByTagName("title"))
        duplicateTitleElements.forEach((element) => element.remove())
    }, [value])

    return null
}

/**
 * @description renders meta tags component assigned to setMetaData
 */
export const MetaTag = () => {
    const { matchedRoutes } = useContext(OneMgRouterContext)
    const routeData = useRouterData()
    const location = useLocation()
    const [metaTags, setMetaTags] = useState([])

    useEffect(() => {
        const mergedMetaTags = getMetaData(matchedRoutes, routeData)
        setMetaTags(Array.isArray(mergedMetaTags) ? mergedMetaTags : [])
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location])

    const titleTag = metaTags.find((tag) => tag.type === "title")
    const nonTitleMetaTags = metaTags.filter((tag) => tag.type !== "title")

    // React 19 does not reconcile titles emitted by the server document with client-side route changes.
    // Update the browser's canonical title instead of rendering another hoisted <title> element.
    return (
        <>
            {titleTag && <DocumentTitle value={titleTag.props.children} />}
            {nonTitleMetaTags}
        </>
    )
}
