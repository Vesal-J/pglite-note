import Paragraph from "@yoopta/paragraph";
import Blockquote from "@yoopta/blockquote";
import Code from "@yoopta/code";
import Link from "@yoopta/link";
import Image from "@yoopta/image";
import Table from "@yoopta/table";
import Divider from "@yoopta/divider";
import Embed from "@yoopta/embed";
import Callout from "@yoopta/callout";
import Lists from "@yoopta/lists";
import Headings from "@yoopta/headings";
import Video from "@yoopta/video";
import Accordion from "@yoopta/accordion";

// Export all available plugins
export const allPlugins = [
  Paragraph,
  Blockquote,
  Code,
  Link,
  Image,
  Table,
  Divider,
  Embed,
  Callout,
  Lists,
  Headings,
  Video,
  Accordion,
];

// Export individual plugins for specific use cases
export { Paragraph, Blockquote, Code, Link, Image, Table, Divider, Embed, Callout, Lists, Headings, Video, Accordion }; 