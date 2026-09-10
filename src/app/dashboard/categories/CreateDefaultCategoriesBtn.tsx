'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { PlusCircle, Loader2 } from 'lucide-react'
import { createDefaultCategories } from './actions'

export function CreateDefaultCategoriesBtn() {
  const [isLoading, setIsLoading] = useState(false)

  const handleCreateDefault = async () => {
    setIsLoading(true)
    try {
      await createDefaultCategories()
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button 
      variant="outline" 
      onClick={handleCreateDefault} 
      disabled={isLoading}
      className="border-dashed"
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : (
        <PlusCircle className="w-4 h-4 mr-2" />
      )}
      Generar Categorías Iniciales
    </Button>
  )
}
