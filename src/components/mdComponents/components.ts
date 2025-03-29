import Anchor from "./Anchor.astro";
import H1 from "./H1.astro"; 
import H2 from "./H2.astro";
import H3 from "./H3.astro";

import OrderedList from "./OrderedList.astro";
import Paragraph from "./Paragraph.astro";
import Strong from "./Strong.astro";
import Emphasis from "./Emphasis.astro";
import Table from "./Table.astro";
import H4 from "./H4.astro";

const defaultComponents = {
  h1: H1,
  h2: H2,
  h3: H3,
  h4: H4,
  a: Anchor,
  p: Paragraph,
  strong: Strong,
  ol: OrderedList,
  em: Emphasis,
  table: Table,
  
  
};

export default defaultComponents;
