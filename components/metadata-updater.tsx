"use client"

import { useEffect } from "react"
import { useI18n } from "@/lib/i18n/context"
import { getMetadataForLanguage } from "@/lib/i18n/get-metadata"

export function MetadataUpdater() {
  const { language } = useI18n()

  useEffect(() => {
    const metadata = getMetadataForLanguage(language)
    
    // Update HTML lang attribute
    document.documentElement.lang = language
    
    // Update meta description
    const descriptionMeta = document.querySelector('meta[name="description"]')
    if (descriptionMeta) {
      descriptionMeta.setAttribute("content", metadata.description)
    }
    
    // Update meta keywords
    let keywordsMeta = document.querySelector('meta[name="keywords"]')
    if (!keywordsMeta) {
      keywordsMeta = document.createElement("meta")
      keywordsMeta.setAttribute("name", "keywords")
      document.head.appendChild(keywordsMeta)
    }
    keywordsMeta.setAttribute("content", metadata.keywords)
    
    // Update Open Graph meta tags
    const updateOrCreateMeta = (property: string, content: string) => {
      let meta = document.querySelector(`meta[property="${property}"]`)
      if (!meta) {
        meta = document.createElement("meta")
        meta.setAttribute("property", property)
        document.head.appendChild(meta)
      }
      meta.setAttribute("content", content)
    }
    
    updateOrCreateMeta("og:title", metadata.openGraph.title)
    updateOrCreateMeta("og:description", metadata.openGraph.description)
    updateOrCreateMeta("og:type", metadata.openGraph.type)
    updateOrCreateMeta("og:locale", metadata.openGraph.locale)
    
    // Update Twitter Card meta tags
    const updateOrCreateTwitter = (name: string, content: string) => {
      let meta = document.querySelector(`meta[name="${name}"]`)
      if (!meta) {
        meta = document.createElement("meta")
        meta.setAttribute("name", name)
        document.head.appendChild(meta)
      }
      meta.setAttribute("content", content)
    }
    
    updateOrCreateTwitter("twitter:card", metadata.twitter.card)
    updateOrCreateTwitter("twitter:title", metadata.twitter.title)
    updateOrCreateTwitter("twitter:description", metadata.twitter.description)
    
    // Update page title
    document.title = metadata.title
  }, [language])

  return null
}
