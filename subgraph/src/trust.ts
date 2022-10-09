import { MediaPost as MediaPostEvent } from "../generated/Trust/Trust"
import { MediaPost } from "../generated/schema"

export function handleMediaPost(event: MediaPostEvent): void {
  let entity = new MediaPost(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.owner = event.params.owner
  entity.dataUri = event.params.dataUri
  entity.timestamp = event.block.timestamp
  entity.save()
}
