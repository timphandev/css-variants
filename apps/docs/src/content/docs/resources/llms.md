---
title: LLMs
description: Machine-readable documentation for AI assistants
---

css-variants provides machine-readable documentation files following the [llms.txt](https://llmstxt.org/) standard, making it easy for AI assistants and LLMs to understand and help you use the library.

## Available Files

### llms.txt

A concise index of all documentation pages with links.

**URL:** [/llms.txt](/llms.txt)

Use this file when you want to give an AI assistant a quick overview of what documentation is available.

### llms-full.txt

Complete documentation in a single file, including:

- Full API reference for all functions (`cv`, `scv`, `sv`, `ssv`, `cx`)
- Core concepts with code examples
- Tailwind CSS integration guide
- TypeScript usage patterns
- Migration guide from CVA
- Performance tips

**URL:** [/llms-full.txt](/llms-full.txt)

Use this file when you want to give an AI assistant comprehensive knowledge about css-variants.

## Usage with AI Assistants

### ChatGPT / Claude

You can reference these files directly in your prompts:

```
Please read https://css-variants.vercel.app/llms-full.txt and help me
create a button component with color and size variants.
```

### Cursor / GitHub Copilot

Add the llms-full.txt content to your project's context or reference it in your prompts for better code suggestions.

## Why llms.txt?

The [llms.txt standard](https://llmstxt.org/) provides a simple way to make documentation accessible to AI systems. Benefits include:

- **Better AI assistance** - AI tools can provide more accurate help when they understand the library
- **Reduced hallucinations** - Concrete documentation reduces made-up API suggestions
- **Up-to-date information** - AI assistants can fetch the latest docs instead of relying on training data
