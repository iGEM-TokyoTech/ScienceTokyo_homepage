import Anchor from "./Anchor.astro";
import Blockquote from "./Blockquote.astro";
import H1 from "./H1.astro"; 
import H2 from "./H2.astro";
import H3 from "./H3.astro";
import Image from "./Image.astro";
import OrderedList from "./OrderedList.astro";
import Paragraph from "./Paragraph.astro";
import Strong from "./Strong.astro";
import UnorderedList from "./UnorderedList.astro";
import Emphasis from "./Emphasis.astro";
import Table from "./Table.astro";
import Tr from "./Tr.astro";
import Td from "./Td.astro";
import Th from "./Th.astro";
import Thead from "./Thead.astro";
import H4 from "./H4.astro";

const defaultComponents = {
  h1: H1,
  h2: H2,
  h3: H3,
  h4: H4,
  img: Image,
  a: Anchor,
  p: Paragraph,
  strong: Strong,
  blockquote: Blockquote,
  ul: UnorderedList,
  ol: OrderedList,
  em: Emphasis,
  table: Table,
  tr: Tr,
  td: Td,
  Th: Th,
  thead: Thead,
};

export default defaultComponents;
