import { ProjectInfo } from '@/types/project-system'

export interface FileTreeNode extends Omit<ProjectInfo, 'children'> {
  isExpanded?: boolean
  children?: FileTreeNode[]
}
