import { inject, Injectable } from '@angular/core';
import { MemoryApi } from './memory-api';
import { BehaviorSubject, Observable } from 'rxjs';
import { Memory } from '../models/memory-model';

@Injectable({
  providedIn: 'root',
})
export class MemoryState {
  private readonly memoryApiService = inject(MemoryApi);

  private readonly _memory = new BehaviorSubject<Memory | null>(null);
  public $memory = this._memory.asObservable();

  private readonly _memories = new BehaviorSubject<Memory[]>([]);
  public $memories = this._memories.asObservable();


  public getMemoriesByTripId(tripId: string): Observable<Memory[]> {
    return this.memoryApiService.GetMemoriesByTripId(tripId);
  }

  public setMemory(memory: Memory): void {
    this._memory.next(memory);
  }

  public getMemory(): Memory | null {
    return this._memory.getValue();
  }

  public setMemories(memories: Memory[]): void {
    console.log(memories)
    this._memories.next(memories);
  }

  public getMemories(): Memory[] {
    return this._memories.getValue();
  }
}
