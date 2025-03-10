import * as postgres from "./postgresql";
import * as sqlite from "./sqlite";

import { dialect } from "@root/drizzle.config";
const schema = dialect == "sqlite" ? sqlite : dialect == "postgresql" ? postgres : sqlite

// All schemas must reflect each other in order to support multiple dialects with ease
/* Alternatively, there COULD be a schema subfolder for each dialect, but it might require more index files..
    P.S. the current implementation is the easiest solution I could find for now.*/

export const {
    userTable,
    scoreTable,
    beatmapTable,
    beatmapSetTable,
    userRelations,
    scoreRelations,
    beatmapRelations,
    beatmapSetRelations
} = schema;
