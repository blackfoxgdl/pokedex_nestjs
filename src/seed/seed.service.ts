import { Injectable } from '@nestjs/common';
import { PokeResponse } from './interfaces/poke-response.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon, PokemonDocument } from '../pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';
import { AxiosAdapter } from '../common/adapters/axios.adapter';

@Injectable()
export class SeedService {
  constructor(
      @InjectModel(Pokemon.name)
      private readonly pokemonModel: Model<PokemonDocument>,
      private readonly http: AxiosAdapter
    ) {}

  async executeSeed() {
    await this.pokemonModel.deleteMany({});

    const data = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=650');

    const pokemonToInsert: { name: string, no: number }[] = [];
 
    //const insertPromisesArray: any[] = [];

    data.results.forEach(({ name, url }) => {
      const segments = url.split('/');
      const no = Number(segments[segments.length - 2]);
      pokemonToInsert.push({ name, no });

      //const pokemon = await this.pokemonModel.create({ name, no });
      /* insertPromisesArray.push(
        this.pokemonModel.create({ name, no })
      ); */
    });

    await this.pokemonModel.insertMany(pokemonToInsert);
    //await Promise.all(insertPromisesArray);

    return "Seed Executed";
  }
}
